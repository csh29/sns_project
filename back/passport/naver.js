const passport = require('passport');
const NaverStrategy = require('passport-naver-v2').Strategy;
require("dotenv").config();
const User = require('../models/user');

module.exports = () => {
   passport.use(
      new NaverStrategy(
         {
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: '/user/naver/callback',
         },
         async (accessToken, refreshToken, profile, done) => {
            console.log('naver profile : ', profile);
            try {
               const exUser = await User.findOne({
                  where: { socialId: profile.id },
               });
               
               if (exUser) {
                await User.update({
                    profileImageUrl: profile.profileImage,
                    accessToken:accessToken
                },{
                    where: {socialId: exUser.socialId}
                })
                const data = { user:exUser ,  accessToken}
                done(null, data)
               } else {
                  const newUser = await User.create({
                    email: profile.email,
                    nickname: profile.nickname,
                    socialId: profile.id,
                    profileImageUrl: profile.profileImage,
                    provider: profile.provider,
                    accessToken:accessToken
                  });
                  const data = { user:newUser ,  accessToken}
                  done(null, data);
               }
            } catch (error) {
               console.error(error);
               done(error);
            }
         },
      ),
   );
};