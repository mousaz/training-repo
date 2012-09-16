var jobs = require('./../routes/jobs'),
    http = require('http');
exports.testResultWithoutQuery = function (test) {
    var req = http.get('http://localhost:8080/jobs', function (res) {
        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });
        res.on('end', function () {
            try {
                var  result =  JSON.parse(pageData.toString());
            }
            catch (error) {
                res.statusCode = 500;
                console.log("the server have unstable data");
            }
            test.ok(result, "the request is empty");
            if (result && result.jobs) {
                test.ok(Array.isArray(result.jobs), "the list is not array");
            }
            if ((result && result.jobs) && Array.isArray(result.jobs)) {
                result.jobs.forEach(function (element, index) {
                    test.ok(element.title, "string", "the title not found at element " + index);
                    test.ok(element.description, "the description not found at element " + index);
                    test.ok(element.pubDate, "the pubDate not found at element " + index);
                });
            }
            test.done();
        });
    }).on('error', function (e) {
            test.ok(false, "there is no data from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);
        });
};
exports.testResultWithQuery = function (test) {
    var query = 'engineer';
    var req = http.get('http://localhost:8080/jobs?filter=' + query, function (res) {
        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });
        res.on('end', function () {
            try {
                var  result =  JSON.parse(pageData.toString());
            }
            catch (error) {
                res.statusCode = 500;
                console.log("the server have unstable data");
            }
            if ((result && result.jobs) && Array.isArray(result.jobs)) {
                result.jobs.forEach(function (element, index) {
                    test.ok(element.title.toLowerCase().indexOf(query) > -1 ||
                        element.description.toLowerCase().indexOf(query) > -1,
                        "the result have no mach at: " + index);
                });
            }
            test.done();
        });
    }).on('error', function (e) {
            test.ok(false, "there is no data from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);
        });
}
exports.testFilterMethod = function (test) {
    var req = http.get('http://localhost:8080/jobs', function (res) {
        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });
        res.on('end', function () {
            try {
                result =  JSON.parse(pageData.toString());
            }
            catch (error) {
                res.statusCode = 500;
                console.log("the server have unstable data");
            }
            if (result && result.jobs) {
                test.ok(Array.isArray(result.jobs), "the result is not found or no Json array");
            }
            test.equal(jobs.filter({ filter: 'Engineer' }, result.jobs).toString(),
                jobs.filter({ filter: 'engineer' }, result.jobs).toString(),
                'the result at "Engineer" not equal "engineer"');
            test.equal(jobs.filter({ filter: 'Program' }, result.jobs ).toString(),
                jobs.filter({ filter: 'proGRam' }, result.jobs).toString(),
                'the result at "Program" not equal "programs"');
            test.done();
        });
    }).on('error', function (e) {
            test.ok(false, "there is no data from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);
        });
}
