const passport = require('passport');
const local = require('./local');
const kakao = require('./kakao');
const naver = require('./naver');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((data, done) => { // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
    done(null, { user: data.user , accessToken : data.accessToken} );
  });

  passport.deserializeUser(async (data, done) => {
    try {
      const user = await User.findOne({ where: { id:data.user.id }});
      user.accessToken = data.accessToken
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
  kakao();
  naver()
};

// 프론트에서 서버로는 cookie만 보내요(clhxy)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 1 발견
// id: 1이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱
