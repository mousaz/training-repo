var express = require('express'),
    news = require('./news.js');

var app = module.exports = express.createServer();

//configure
app.use(express.bodyParser());


// Routes
app.get('/news', function (req, res) {
    var filter = req.param('filter', null);
    news.bringData(res, filter);
});


//Error handling
app.use(function (err, req, res, next) {
    var error = '{statusCode: 500, message: "Something went wrong in server, try again"}';

    res.writeHead(500, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(error));
});
app.use(function (req, res, next) {
    var error = '{statusCode: 404, message: "The requested URL is not valid!"}';

    res.writeHead(404, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(error));
});

//start
app.listen(8080);