var jobs = require('./../routes/jobs'),
    http = require('http');

exports.testFilter = function (test) {
    var req = http.get('http://localhost:8080/jobs', function (res) {

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
            if (result && result.jobs){
                test.ok(Array.isArray(result.jobs), "the result is not found or no Json array");
            }
            test.equal(jobs.filter({ filter: 'Engineer' }, result.jobs).toString(), jobs.filter({ filter: 'engineer' }, result.jobs).toString(), 'the result at "Engineer" not equal "engineer"');
            test.notEqual(jobs.filter({ filter: 'Program' }, result.jobs), jobs.filter({ filter: 'program' }, result.jobs), 'the result at "Program" is equal "programs"');
            test.notEqual(jobs.filter({  }, result.jobs), jobs.filter({ filter: 'program' }, result.jobs), 'the query  at "Program" is equal empty query');

            test.done();
        });

    }).on('error', function (e) {
            test.ok(false, "there is no data resevice from service or the server is down or unreachable");
            test.done();
            console.error("Got error: " + e.message);
        });
}
