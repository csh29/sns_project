const axios = require('axios');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();
require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

router.post("/updatenickname", isLoggedIn , async (req,res,next) => {
  try{
    await User.update({
      nickname: req.body.nickname
    },{
      where : {id:req.user.id}
    })

    res.status(200).json({nickname: req.body.nickname})
  } catch (err) {
    console.log(err);
    next(err);
  }
})

router.post("/follow",isLoggedIn, async (req,res,next) => {
  try{
    
    const user = await User.findOne({
      where: { id: req.body.targetId }
    })

    if(!user) {
      res.status(403).send('팔로우하려는 유저가 없습니다.');
    }

    if(req.body.type === 'follow') {
      await user.addFollowers(req.user.id);
    } else if(req.body.type === 'unFollow'){
      await user.removeFollowers(req.user.id);
    }
    res.status(200).json({ UserId: parseInt(req.body.targetId, 10),nickname: user.nickname , type:req.body.type });    
  } catch(err) {
    console.log(err);
    next(err)
  }
})

router.post("/logout",async(req,res,next) => {
  if(req.body.provider === 'naver') {
    const client_id = process.env.NAVER_CLIENT_ID;
    const client_secret = process.env.NAVER_CLIENT_SECRET;
    const access_token = req.user?.accessToken;
    const logoutUrl = "https://nid.naver.com/oauth2.0/token?grant_type=delete";

    const result = await axios.get(`${logoutUrl}&client_id=${client_id}&client_secret=${client_secret}&access_token=${access_token}&service_provider=NAVER`);
    
  }

  req.logout();
  req.session.destroy();
  res.send('ok');
})

router.post("/update/reception", isLoggedIn, async (req,res,next) => {
  try{ 

    const user = await User.findOne({
      where: {id: req.user.id}
    })

    const reception = user.notiReception === 'Y' ? 'N' : 'Y';

    if(user) {
      await User.update({
        notiReception: reception
      },{
        where : {id:req.user.id}
      })
    }
    res.status(200).json({reception});
  } catch (err) {
    console.log(err);
    next(err);
  }
})

router.get("/",async (req,res,next) => {
  try{
    if(req.user) {
      const findUser = await User.findOne({
        where: {id: req.user.id},
        attributes:{
          exclude:['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id','nickname','profileImageUrl','profileImageUrl','email'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id','nickname','profileImageUrl','profileImageUrl','email'],
        }]
      })
      res.status(200).json(findUser);
    } else {
      res.status(200).json(null);
    }
    
  } catch(err) {

  }
})

router.post("/signup",isNotLoggedIn,async (req, res, next) => {
  try{
    const findUser = await User.findOne({
      where: {email: req.body.email}
    })
    if(findUser) {
      return res.status(401).send("이미 존재하는 사용자입니다.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.create({
      nickname:req.body.nickname,
      email:req.body.email,
      password:hashedPassword,
      sociallogin:'N'
    })

    return res.status(201).send('ok');
  } catch(err) {
    console.error(err);
    next(err); // status 500
  }

})

router.get('/social/naver/login', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', {
    failureRedirect: '/',
}), (req, res) => {
  return req.login(req.user, async (loginErr) => {
    if (loginErr) {
      console.error(loginErr);
      return next(loginErr);
    }
    res.redirect(process.env.NEXT_APP);
  });
});



router.get('/social/kakao/login',passport.authenticate('kakao'));

router.get('/kakao/callback',
  passport.authenticate('kakao', {
     failureRedirect: '/fail',
  }),
  (req, res) => {
     //
     return req.login(req.user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      
      res.redirect(process.env.NEXT_APP);
    });

  },
);



router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login({user}, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id','nickname','profileImageUrl','email'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id','nickname','profileImageUrl','email'],
        }]
      })
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.get("/search/:userId",isLoggedIn, async (req,res,next) => {
  try{

    const findUser = await User.findOne({
      where: {id: req.params.userId},
      attributes:{
        exclude:['password']
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id','nickname','profileImageUrl','email'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id','nickname','profileImageUrl','email'],
      }]
    })
    res.status(200).json(findUser);

  } catch(err) {
    console.log(err);
    next(err);
  }
})

router.post("/profile",isLoggedIn, async (req,res,next) => {
  try{
    const user = await User.findOne({
      where: {id: req.user.id}
    })

    const openProfile = user.openProfile === 'Y' ? 'N' : 'Y';

    if(user) {
      await User.update({
        openProfile
      },{
        where : {id:req.user.id}
      })
    }
    res.status(200).json({openProfile});

  } catch(err) {
    console.log(err);
    next(err);
  }
})

module.exports = router;
