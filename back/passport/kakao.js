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
                const profileImage = profile._json.properties.profile_image
                const exUser = await User.findOne({
                    where : {email: profile.displayName+"_kakao"}
                });

                if(!exUser) {
                    const hashedPassword = await bcrypt.hash(profile.id+'', 12);

                    const newUser = await User.create({                    
                        email: profile.displayName+"_kakao",
                        nickname: profile.displayName,
                        socialId: hashedPassword,
                        profileImageUrl: profileImage,
                        accessToken:accessToken,
                        provider: 'kakao'
                    });
                    const data = { user:newUser ,  accessToken}
                    done(null, data)
                } else {
                    const result = await bcrypt.compare(profile.id+'', exUser.socialId);
    
                    if(result) {
                        await User.update({
                            profileImageUrl: profileImage,
                            accessToken:accessToken
                        },{
                            where: {socialId: exUser.socialId}
                        })
                        const data = { user:exUser ,  accessToken}
                        done(null, data)
                    } 
                }

                
            }catch(error){
                console.log(error)
            }
        }
        )
    )
    
}