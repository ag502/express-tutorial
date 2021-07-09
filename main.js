const express = require('express');
const app = express();
const fs = require('fs');
const qs = require('querystring');
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
                <a href="/update/${sanitizedTitle}">update</a>
                <form action="/delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
      );
      res.send(html);
    });
  });
});

app.get('/create', (req, res) => {
  fs.readdir('./data', (error, filelist) => {
    const title = 'WEB - create';
    const list = template.list(filelist);
    const html = template.HTML(
      title,
      list,
      `
            <form action="/create_process" method="post">
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
});

app.post('/create_process', (req, res) => {
  let body = '';
  req.on('data', (data) => {
    body = body + data;
  });
  req.on('end', () => {
    const post = qs.parse(body);
    const title = post.title;
    const description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
      res.redirect('/');
    });
  });
});

app.get('/update/:pageId', (req, res) => {
  fs.readdir('./data', (error, filelist) => {
    const filteredId = req.params.pageId;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      const title = filteredId;
      const list = template.list(filelist);
      const html = template.HTML(
        title,
        list,
        `
              <form action="/update_process" method="post">
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
        `<a href="/create">create</a><a href="/update/${title}">update</a>`
      );
      res.send(html);
    });
  });
});

app.post('/update_process', (req, res) => {
  let body = '';
  req.on('data', (data) => {
    body = body + data;
  });
  req.on('end', () => {
    const post = qs.parse(body);
    const id = post.id;
    const title = post.title;
    const description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, (error) => {
      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        res.redirect('/');
      });
    });
  });
});

app.use('/delete_process', (req, res) => {
  let body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', () => {
    const post = qs.parse(body);
    const id = post.id;
    const filteredId = id;
    fs.unlink(`data/${filteredId}`, function (error) {
      res.redirect('/');
    });
  });
});

app.listen(5000, () => console.log('Listening on 5000'));
