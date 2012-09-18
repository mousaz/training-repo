var express = require('express'),
    jobs = require('./routes/jobs.js'),
    docRouter = require('docrouter').DocRouter,
    port = process.env.PORT || 8080,
    app = express.createServer();

app.use('/jobs', docRouter(express.router, '/jobs', function (app) {
    app.get('/', function (req, res) {
            jobs.list(req, res);
        },
        {
            id: 'jobs-feed',
            name: 'jobs feed document',
            usage: '/jobs[?filter=filter_value]',
            doc: 'Returns a list of the jobs announced on jobs.ps. If a filter is passed, returns only results matching that filter',
            example: '/jobs?filter=engineer',
            params: {
                "filter" : {
                    "type": "string",
                    "doc": 'When specified, only job entries that match the filter value will be returned',
                    "style": "query",
                    "required": "false"
                }
            },
            response: {
                representations: ["application/json"]
            }

        }
    );
}));
app.listen(port);
console.log('listening on port', port);