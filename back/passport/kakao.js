const bcrypt = require('bcrypt');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
require("dotenv").config();
const { User } = require('../models');


module.exports = () => {
    passport.use(
        new KakaoStrategy({
            clientID: process.env.KAKAO_RESTAPI_KEY,
            callbackURL: '/user/kakao/callback',
        },
        async(accessToken, refreshToken, profile, done) => {        
            try{
                const exUser = await User.findOne({
                    where : {kakaoId: profile.id}
                });
                const profileImage = profile._json.properties.profile_image
                if(exUser){
                    await User.update({
                        profileImageUrl: profileImage
                    },{
                        where: {kakaoId: profile.id}
                    })
                    const data = { user:exUser ,  accessToken}
                    done(null, data)
                } else {
                    const newUser = await User.create({                    
                        email: profile.displayName+"_kakao",
                        nickname: profile.displayName,
                        userId: profile.id,
                        kakaoId: profile.id,
                        profileImageUrl: profileImage
                    });
                    const data = { user:newUser ,  accessToken}
                    done(null, data)
                }
            }catch(error){
                console.log(error)
            }
        }
        )
    )
    
}