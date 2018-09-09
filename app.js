const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/assign08');
let db = mongoose.connection;

db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
    console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/articles')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});

// Get Single Article
app.get('/articles/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        });
    });
});

// Add Route
app.get('/article/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article',
    });
});

// Add Submit POST Route
app.post('/article/add', function (req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });

});

// Update Submit POST Route

app.post('/articles/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    }
    // console.log(req.params.i)
    Article.update(query, article, function (err) {
        if (err) {
            // console.log('fuck')
            console.log(err);
            return;
        } else {
            // console.log('win')
            res.redirect('/');
        }
    });

});

// Get Single Article
app.get('/articles/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

app.delete('/articles/:id',function(req,res){
    let query = {_id:req.params.id}

    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});

// Start Server
app.listen(3000, function () {
    console.log('Server started on port 3000...')
});