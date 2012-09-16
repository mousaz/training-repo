
var express = require('express'),
    route_sucess = require('./routes/success_router.js');

var app = module.exports = express.createServer();


// Routes
app.get('/news', route_sucess.index);

//Error handling
app.use(function(err, req, res, next){
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end();
});

app.use(function(req, res, next){
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end();
});


app.listen(8080);