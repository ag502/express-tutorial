const express = require('express');
const app = express();
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
