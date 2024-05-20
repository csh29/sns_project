const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();
const { Post, Image, Comment, User, Hashtag } = require('../models');
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const upload = multer({
    // 파일 저장 위치 (disk , memory 선택)
    storage: multer.diskStorage({
        destination: function (req, file, done) {
            done(null, 'upload/');
        },
        filename: function (req, file, done) {
            done(null, Date.now() + file.originalname);
        }
    }),
    // 파일 허용 사이즈 (5 MB)
    limits: { fileSize: 5 * 1024 * 1024 }
  });

  const profileUploader = multer({
    // 파일 저장 위치 (disk , memory 선택)
    storage: multer.diskStorage({
        destination: function (req, file, done) {
            done(null, 'profile/');
        },
        filename: function (req, file, done) {
            done(null, Date.now() + file.originalname);
        }
    }),
    // 파일 허용 사이즈 (5 MB)
    limits: { fileSize: 5 * 1024 * 1024 }
  });

  router.post("/profile",isLoggedIn,profileUploader.single("file"),async (req,res,next) => {
    try{
      
      const profileImageUrl = `${process.env.NODE_SERVER}/profile/${req.file.filename}`;
      await User.update({
        profileImageUrl: profileImageUrl
      },{
        where : {id: req.user.id}
      })

      res.status(200).json({profileImageUrl});
    } catch(err) {
      console.log(err);
      next(err)
    }
  })
  router.delete("/removeall/:postId",isLoggedIn, async (req,res,next) => {
    try{
      const findImages = await Image.findAll({
        where: {PostId:req.params.postId}
      })

      findImages.forEach(img => {
        try{
          fs.unlinkSync("./upload/" + img.filename);
        }catch(err) {
          
        }
        
        Image.destroy({
          where : {
            PostId: req.params.postId
          }
        })

      })

    } catch(err) {
      console.log(err);
      next(err);
    }
  })

  router.post("/removeimage",isLoggedIn,async (req,res,next) => {
    try{
       const { filename , id } = req.body.removeFile;
       fs.unlinkSync("./upload/" + filename);
       
       if(id) {
          await Image.destroy({
            where : {
              id: id
            }
          })
       }
       res.status(200).json({ filename:filename , imgId:id, postId : req.body.postId });
    } catch( err ) {
      console.log(err)
      next(err);
    }
  })

  router.post("/removelist",isLoggedIn,async (req , res ,next) => {
    try{
      const removelist = req.body.removelist;
      
      removelist.forEach(file => {
        const fileName = file.filename
        try {
            fs.unlinkSync("./upload/" + fileName);
            console.log("image delete");
          } catch (error) {
            console.log(error);
            next(error);
          }
      })

      res.status(200).json("ok");
    
    } catch(err) {
      console.log(err)
      next(err);
    }
  })

  router.post("/remove/profile",isLoggedIn, async(req,res,next) => {
    try{
      const user = await User.findOne({where:{id: req.user.id}})
      const url = user.profileImageUrl;
      if(url) {
        
        fs.unlinkSync(`.${url.substr(url.indexOf("/profile"))}`);
      }
      
      await User.update({
        profileImageUrl: null
      },{
        where: {id:req.user.id}
      })

      res.status(200)
    }catch(err) {
      console.log(err)
      next(err);
    }
  })
  
  router.post("/upload",isLoggedIn, upload.array("file"), (req , res , next) => {
      try{
        res.status(200).json(req.files);
      } catch (err) {
        console.log(err)
        next(err);
      }
  })

  module.exports = router;