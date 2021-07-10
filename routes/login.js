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
            <p><input type="email"/></p>
            <p><input type="password"/></p>
            <p><input type="submit"/></p>
        </form>
    `,
    `<a href='/topic/create'>create</a>`
  );
  res.send(html);
});

module.exports = router;
