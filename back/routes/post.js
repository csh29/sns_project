const express = require('express');
const path = require('path');
const { Op } = require('sequelize');
const { Post, Image, Comment, User, Hashtag, Notification } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post("/retweet", isLoggedIn, async(req,res,next) => {
  try{
    const id = req.body.postId;
    const userId = req.user.id;
    const post = await Post.findOne({
      where : { id },
      include: [{
        model: Post,
        as: 'Retweet',
      }],
    })

    if(!post){
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }

    if(post.UserId === userId || post.Retweet?.UserId === req.user.id) {
      return res.status(403).send('자신의 게시글은 리트윗 할수 없습니다.');
    }

    const targetId = post.RetweetId || post.id;

    const exPost = await Post.findOne({
      where : {
        UserId: req.user.id,
        RetweetId: targetId,
      }
    })

    if(exPost) {
      return res.status(403).send('이미 리트윗 했습니다.');
    }

    

    const retweetPost = await Post.create({
      content:'retweet',
      UserId: userId,
      RetweetId: targetId,
    })

    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweetPost.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id','nickname','profileImageUrl'],
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }],
    })

    res.status(201).json(retweetWithPrevPost);
  } catch (err) {
    console.log(err);
    next(err);
  }
})

router.post("/like", async (req,res,next) => {
  try{
    const post = await Post.findOne({
      where: {id: req.body.postId}
    })

    if(!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }

    post.addLikers(req.user.id)

    const { id:UserId , nickname , profileImageUrl } = req.user;
    res.status(201).json({ PostId: post.id, UserId , nickname , profileImageUrl });
  }catch(err) {
    console.log(err);
    next(err);
  }
})

router.delete("/:postId/like", async (req,res,next) => {
  try{
    const post = await Post.findOne({
      where: {id: req.params.postId}
    })

    if(!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }

    post.removeLikers(req.user.id)
    res.status(201).json({ PostId: post.id, UserId: req.user.id });
  }catch(err) {
    console.log(err);
    next(err);
  }
})


router.delete("/:postId", async (req,res,next) => {
  try{
    await Comment.destroy({
      where : {
        UserId: req.user.id,
        PostId: req.params.postId
      }
    })

    await Post.destroy({
      where :{
        id:req.params.postId,
        UserId: req.user.id,
      }
    })

    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  }catch(err) {
    console.log(err);
    next(err);
  }
})

router.post("/post/:postId", async (req,res,next) => {
  try{
    await Post.update(
      {
        content: req.body.content
      },
      {
        where : {id:req.params.postId}
      }
    )
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const findPost = await Post.findOne({ where: { id: req.params.postId }});
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[노드, true], [리액트, true]]
      await findPost.setHashtags(result.map((v) => v[0]));
    }
    let images;
    if(req.body?.uploadList?.length > 0 ) {
      const uploadList = req.body.uploadList;
      images = await Promise.all(uploadList.map(file => Image.create({src:"/upload/"+file.filename,filename:file.filename })))
      await findPost.addImages(images)
    }

      res.status(201).json({ images : images, content : req.body.content , PostId:parseInt(req.params.postId)})
  } catch(err) {
    console.log(err);
    next(err)
  }
})

router.post("/comment", isLoggedIn , async (req,res,next) => {
  try{
    const comment = await Comment.create({
      PostId: req.body.postId,
      content: req.body.content,
      UserId: req.user.id
    })

    const emails = req.body.emails
    const set = new Set(emails);
    const uniqueArr = [...set];
    for (const email of uniqueArr) {
        const user = await User.findOne({where:{email}})

        await Notification.create({
          content:req.body.content,
          senderId: req.user.id,
          targetId: user.id,
          commentId: comment.id,
          UserId:req.user.id,
          reception: 'N',
        })
    }

    const resultComment = await Comment.findOne({
      where: {id : comment.id},
      include:[{
        model : User,
        attributes: ['id', 'nickname', 'profileImageUrl'],
      }]
    })

    res.status(201).json(resultComment)
  }catch(err) {
    console.log(err);
  }
})

router.delete("/comment/:commentId", isLoggedIn , async(req,res,next) => {
  try{
    const commentId = req.params.commentId;

    await Notification.destroy({
      where : {
        commentId
      }
    })

    await Comment.destroy({
      where : {
        id: commentId
      }
    })
    res.status(201).json({commentId})
  } catch (err) {
    console.log(err)
  }
})

router.get("/", async (req,res,next) => {
  try{

    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    }

    if (req.query.id) {
      where.UserId = req.query.id;
    }

    const results = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname','profileImageUrl'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'profileImageUrl'],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id','nickname','profileImageUrl'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname','profileImageUrl'],
        }, {
          model: Image,
        }]
      }],
    })

    res.status(200).json(results);
  }catch (err){
    console.log(err);
    res.status(200).send("게시글 조회 실패 했습니다.");
  }
})

router.post("/addpost" , isLoggedIn, async (req,res,next) => {
  try{
    const hashtags = req.body.text.match(/#[^\s#]+/g);
    
    const post = await Post.create({
      content:req.body.text,
      UserId: req.user.id,
    })


    if(hashtags){
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[노드, true], [리액트, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }

    if(req.body?.saveFileList?.length > 0 ) {
      const saveFileList = req.body.saveFileList;
      const images = await Promise.all(saveFileList.map(file => Image.create({src:"/upload/"+file.filename,filename:file.filename })))
      await post.addImages(images)
    }

    const resultPost = await Post.findOne({
      where: { id: post.id },
      include:[{
        model: Image,
      },{
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      },{
        model: User, // 게시글 작성자
        attributes: ['id', 'nickname','profileImageUrl'],
      },{
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id','nickname','profileImageUrl'],
      }]
    })

    res.status(200).json(resultPost);
  } catch(err) {
    console.log(err)
    next(err);
  }
})


router.get("/hashtag/:hashtag",isLoggedIn, async(req,res,next) => {
  try{
    const where = {};
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const results = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model:Hashtag,
        where:{name: req.params.hashtag}
      },{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id','nickname','profileImageUrl'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }],
    })
    res.status(200).json(results);
  } catch(err) {
    console.log(err)
    next(err)
  }
})
module.exports = router;
