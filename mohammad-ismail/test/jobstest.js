var jobs = require('./../routes/jobs'),
    request = require('request');
exports.testResultWithoutQuery = function (test) {
    var req = request('http://localhost:8080/jobs', function (error, res, body) {
        if (error && res.statusCode !== 200) {
            test.ok(false, "there is no data from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);
        }
        try {
            var  result =  JSON.parse(body.toString());
        }
        catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ statusCode: 500, message: "error at server" }));
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
};
exports.testResultWithQuery = function (test) {
    var query = 'engineer';
    var req = request.get('http://localhost:8080/jobs?filter=' + query, function (error, res, body) {
        if (error && res.statusCode !== 200) {
            test.ok(false, "there is no data from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);}
        try {
            var  result =  JSON.parse(body.toString());
        }
        catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ statusCode: 500, message: "error at server" }));
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
}
exports.testFilterMethod = function (test) {
    var req = request.get('http://localhost:8080/jobs', function (error, res, body) {
        if (error || res.statusCode !== 200) {
            test.ok(false, "there is no data from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);}
        try {
           var result =  JSON.parse(body.toString());
        }
        catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ statusCode: 500, message: "error at server" }));
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
}
