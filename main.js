const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const compression = require('compression');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template');
const mainRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const topicRouter = require('./routes/topic');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());

app.get('*', (req, res, next) => {
  fs.readdir('./data', (error, files) => {
    if (error) {
      next(err);
    } else {
      req.list = files;
      next();
    }
  });
});
app.get('*', (req, res, next) => {
  req.loginUI = '<a href="/login">로그인</a>';
  if (req.cookies) {
    const { email, password } = req.cookies;
    if (email === 'ag502@naver.com' && password === '111') {
      req.loginUI = '<a href="/logout_process">로그아웃</a>';
      console.log('a');
    }
  }
  next();
});

app.use(mainRouter);
app.use(loginRouter);
app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('something broke!');
});

app.listen(5000, () => console.log('Listening on 5000'));
