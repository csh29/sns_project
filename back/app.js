const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');
const notificationRouter = require('./routes/notification');
const db = require('./models');
const passportConfig = require('./passport');

const port = process.env.APP_PORT || 3010;

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express();
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use(morgan('dev'));
app.use(cors({
  origin: process.env.NEXT_APP,
  credentials: true,
}));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello express');
});

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/upload', uploadRouter);
app.use('/notification', notificationRouter);

app.get('/upload/:filename',(req,res) => {
  const filename = req.params.filename;
  fs.readFile("./upload/"+filename, (error,data) => {
    console.log(error,data)
    res.writeHead(200, { 'Content-Type':'text/html'});
    res.end(data)
  })
})

app.get('/profile/:filename',(req,res) => {
  const filename = req.params.filename;
  fs.readFile("./profile/"+filename, (error,data) => {
    console.log(error,data)
    res.writeHead(200, { 'Content-Type':'text/html'});
    res.end(data)
  })
})

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});
