const express = require('express');
const router = express.Router();
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');

router.get('/create', (req, res) => {
  const files = req.list;
  const title = 'WEB - create';
  const list = template.list(files);
  const html = template.HTML(
    title,
    list,
    `
                <form action="/topic/create_process" method="post">
                  <p><input type="text" name="title" placeholder="title"></p>
                  <p>
                    <textarea name="description" placeholder="description"></textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
              `,
    ''
  );
  res.send(html);
});

router.post('/create_process', (req, res) => {
  const post = req.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
    res.redirect('/');
  });
});

router.get('/:pageId', (req, res, next) => {
  const files = req.list;
  const filteredId = req.params.pageId;
  fs.readFile(`./data/${filteredId}`, 'utf8', (err, description) => {
    if (err) {
      next(err);
    } else {
      const title = filteredId;
      const sanitizedTitle = sanitizeHtml(title);
      const sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1'],
      });
      const list = template.list(files);
      const html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
                      <a href="/topic/update/${sanitizedTitle}">update</a>
                      <form action="/topic/delete_process" method="post">
                        <input type="hidden" name="id" value="${sanitizedTitle}">
                        <input type="submit" value="delete">
                      </form>`
      );
      res.send(html);
    }
  });
});

router.get('/update/:pageId', (req, res) => {
  const files = req.list;
  const filteredId = req.params.pageId;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
    const title = filteredId;
    const list = template.list(files);
    const html = template.HTML(
      title,
      list,
      `
                <form action="/topic/update_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
      `<a href="/topic/create">create</a><a href="/topic/update/${title}">update</a>`
    );
    res.send(html);
  });
});

router.post('/update_process', (req, res) => {
  const post = req.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
    res.redirect('/');
  });
});

router.post('/delete_process', (req, res) => {
  const post = req.body;
  const id = post.id;
  const filteredId = id;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect('/');
  });
});

module.exports = router;
