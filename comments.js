// create web server


// import module
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// set up body parser
app.use(bodyParser.urlencoded({extended: true}));

// set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set up public folder
app.use(express.static(path.join(__dirname, 'public')));

// read json file
let comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// set up routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Comments',
    comments: comments
  });
});

app.get('/new', (req, res) => {
  res.render('new', {
    title: 'New Comment'
  });
});

app.post('/new', (req, res) => {
  let comment = {
    name: req.body.name,
    content: req.body.content
  };
  comments.push(comment);
  fs.writeFileSync('comments.json', JSON.stringify(comments));
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  res.render('edit', {
    title: 'Edit Comment',
    comment: comments[req.params.id],
    id: req.params.id
  });
});

app.post('/edit/:id', (req, res) => {
  comments[req.params.id].name = req.body.name;
  comments[req.params.id].content = req.body.content;
  fs.writeFileSync('comments.json', JSON.stringify(comments));
  res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
  comments.splice(req.params.id, 1);
  fs.writeFileSync('comments.json', JSON.stringify(comments));
  res.redirect('/');
});

// start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
