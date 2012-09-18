
var express = require('express'),
    news = require('./news.js');

var app = module.exports = express.createServer();


// Routes
app.get('/news', function (req, res) {
    news.bringData(res);
});

//Error handling
app.use(function (err, req, res, next) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end();
});

app.use(function (req, res, next) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end();
});


app.listen(8080);