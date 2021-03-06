const express = require('express');
const router = express.Router();
const template = require('../lib/template');

router.get('/', (req, res) => {
  const files = req.list;
  const title = 'Welcome';
  const description = 'Hello, node.js';
  const list = template.list(files);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
      <img src="/img/hello.jpg"/>
      `,
    `<a href='/topic/create'>create</a>`,
    req.loginUI
  );
  res.send(html);
});

module.exports = router;
