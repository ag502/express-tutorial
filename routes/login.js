const express = require('express');
const router = express.Router();
const template = require('../lib/template');

router.get('/login', (req, res) => {
  const files = req.list;
  const title = 'Welcome';
  const description = 'Hello, node.js';
  const list = template.list(files);
  const html = template.HTML(
    title,
    list,
    `
        <form action="/login_process" method="post">
            <p><input type="email" name="email"/></p>
            <p><input type="password" name="password"/></p>
            <p><input type="submit"/></p>
        </form>
    `,
    `<a href='/topic/create'>create</a>`,
    req.loginUI
  );
  res.send(html);
});

router.post('/login_process', (req, res) => {
  const { email, password } = req.body;
  if (email === 'ag502@naver.com' && password === '111') {
    console.log(req.session);
    req.session.isLogin = true;
    req.session.save(() => {
      res.redirect('/');
    });
  } else {
    console.log('Who?');
  }
});

router.get('/logout_process', (req, res) => {
  res.clearCookie('email');
  res.clearCookie('password');
  res.redirect('/');
});

module.exports = router;
