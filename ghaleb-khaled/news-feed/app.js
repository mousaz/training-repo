var express = require('express'),
    news = require('./news.js'),
    docRouter = require('docrouter').DocRouter,
    port = process.env.Port || 8080;

var app = module.exports = express.createServer();

function requestHandler(req, res) {
    var filter = req.param('filter', null);
    news.bringData(res, filter);
}

//Router and docRouter
app.use("/news", docRouter(express.router, "/news", function (app) {
    app.get('/', requestHandler, {
        id: "GetApp",
        doc: "Get news-feed",
        params: {
            filter: {
                type: "string",
                required: false,
                style: "query",
                description: "filter the news and permit news with " +
                    "title or description contains the keyword"
            }
        },
        response: {
            representations: ["application/json"]
        }
    });
}));


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
app.listen(port);