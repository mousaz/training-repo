var jobs = require('./../routes/jobs'),
    http = require('http');

exports.testList = function (test) {
    var result;

    req = http.get('http://localhost:8080/jobs', function (res) {
        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });
        res.on('end', function () {
            try {
                result =  JSON.parse(pageData.toString());
            } catch (error) {
                res.statusCode = 500;
                console.log("the server have unstable data");
            }

            test.ok(result, "the request is empty");
            if (result&& result.jobs)
                test.ok(Array.isArray(result.jobs), "the list is not array");
            if ( (result&&result.jobs)&& Array.isArray(result.jobs)) {
                result.jobs.forEach( function (element, index) {
                    test.ok(element.title, "string", "the title not found at element " + index);
                    test.ok(element.description, "the description not found at element " + index);
                    test.ok(element.pubDate, "the pubDate not found at element " + index);
                });
            }
            test.done();
        });
    }).on('error', function(e) {
            test.ok(false,"there is no data resevice from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);
        });
};
