var express = require('express' ),
    jobs = require('./routes/jobs'),
    http = require('http');

var app = express();
app.configure(function () {
    app.set('port', process.env.PORT || 8080);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});
app.configure('development', function () {
    app.use(express.errorHandler());
});
app.get('/jobs', jobs.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
