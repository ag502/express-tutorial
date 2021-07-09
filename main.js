const express = require('express');
const app = express();
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
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

app.get('/page/:pageId', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    const filteredId = req.params.pageId;
    fs.readFile(`./data/${filteredId}`, 'utf8', (err, description) => {
      const title = filteredId;
      const sanitizedTitle = sanitizeHtml(title);
      const sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1'],
      });
      const list = template.list(filelist);
      const html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
      );
      res.send(html);
    });
  });
});

app.listen(5000, () => console.log('Listening on 5000'));
