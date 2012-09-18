var express = require('express'),
    news = require('./news.js');

var app = module.exports = express.createServer();


// Routes
app.get('/news', function (req, res) {
    news.bringData(res);
});

//Error handling
app.use(function (err, req, res, next) {
    var error = '{statusCode: 500, message: "Something went wrong in server, try again"}';

    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify(error));
});

app.use(function (req, res, next) {
    var error = '{statusCode: 404, message: "The requested URL is not valid!"}';

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify(error));
});


app.listen(8080);