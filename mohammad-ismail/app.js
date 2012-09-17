var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    jobs = require('./routes/jobs.js'),
    docRouter = require('docrouter').DocRouter,
    url = require('url'),
    port = process.env.PORT || 8080,
    app = express.createServer();
process.chdir(__dirname);
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.cookieParser());
app.use('/jobs', docRouter(express.router, '/jobs', function (app) {
    app.get('/', function (req, res) {
            jobs.list(req, res);
        },
        {
            id: 'sample_json',
            name: 'json',
            usage: 'for filter the result by title or description',
            doc: 'parse xml data from jobs.ps/rss feed and reform it to Json object',
            example: 'filter=engineer',
            params: {
                "filter" : {
                    "short": "filter",
                    "type": "string",
                    "doc": 'filter the Json data from which is mach with title or description tags',
                    "style": "template",
                    "required": "false"
                }
            }
        }
    );
}));
app.listen(port);
console.log('listening on port', port);