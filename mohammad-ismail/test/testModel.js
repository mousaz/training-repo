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
                console.log("the server have unstable data");
            }


            test.notEqual(undefined, result, "the request is empty");
            if(result != undefined && result.jobs != undefined)
                test.ok(Array.isArray(result.jobs), "the list is not array");
            if ( Array.isArray(result.jobs) && (result != undefined && undefined != result.jobs) ) {
                for ( var i = 0; i < result.jobs.length; i++ ) {
                    test.notEqual ( undefined, result.jobs[i].title, "string", "the title not found at element " + i );
                }
                for ( var i = 0; i < result.jobs.length; i++ ) {
                    test.notEqual ( undefined, result.jobs[i].description, "the description not found at element " + i );
                }
                for ( var i = 0; i < result.jobs.length; i++ ) {
                    test.notEqual ( undefined, result.jobs[i].pubDate, "the pubDate not found at element " + i );
                }
            }
            test.done();
        });
    }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
};
