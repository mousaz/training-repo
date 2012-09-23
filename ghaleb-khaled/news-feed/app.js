var express = require('express'),
    news = require('./news.js'),
    docRouter = require('docrouter').DocRouter;

var app = module.exports = express.createServer();

//docRouter
docRouter(app, "News-Feed");

// Routes
app.get('/news', requestHandler, {
    id:"GetApp",
    doc:"Get news-feed",
    params:{
        filter:{
            type:"string",
            required:false,
            optional:true,
            description:"filter the news and permit news with " +
                "title or description contains the keyword"
        }
    }
});

function requestHandler (req,res) {
    var filter = req.param('filter', null);
    news.bringData(res, filter);
}


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