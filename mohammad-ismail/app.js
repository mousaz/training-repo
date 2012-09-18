var express = require('express'),
    jobs = require('./routes/jobs.js'),
    docRouter = require('docrouter').DocRouter,
    port = process.env.PORT || 8080,
    app = express.createServer();

app.use('/jobs', docRouter(express.router, '/jobs[?filter=]', function (app) {
    app.get('/', function (req, res) {
            jobs.list(req, res);
        },
        {
            id: 'sample_json',
            name: 'json',
            usage: 'for filter the result by title or description',
            doc: 'Returns a list of the jobs announced on jobs.ps. If a filter is passed, returns only results matching that filter',
            example: '/jobs?filter=engineer',
            params: {
                "filter" : {
                    "short": "filter",
                    "type": "string",
                    "doc": 'When specified, only job enteries that match the filter value will be returned',
                    "style": "/jobs?filter=engineer",
                    "required": "false"
                }
            }
        }
    );
}));
app.listen(port);
console.log('listening on port', port);