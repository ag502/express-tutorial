const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template');

app.get('/', (req, res) => {
  fs.readdir('./data', (error, files) => {
    const title = 'Welcome';
    const description = 'Hello, node.js';
    const list = template.list(files);
    const html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href='/create'>create</a>`
    );
    res.send(html);
  });
});

app.listen(5000, () => console.log('Listening on 5000'));
