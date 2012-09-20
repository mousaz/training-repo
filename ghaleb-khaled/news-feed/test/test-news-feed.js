var http = require('http');
var server = 'http://127.0.0.1:8080/news';


function testPath(path, test, cb) {
    var resData = new String();
    http.get(server + path, function (res) {

        res.on('data', function (chunk) {
            resData += chunk;
        });
        res.on('end', function () {
            cb(resData);
        });
    }).on('error', function (e) {
        test.ok(false, "request failed");
        test.done();
    });

}

exports.testItem = function (test) {
    var trueValue = "Soldier has baby in Afghanistan";
    testPath('?filter=Afghanistan', test, function (testValue) {
        try {
            test.equal(JSON.parse(testValue).news[0].title, trueValue, "retrieved data is not valid");
        } catch (e) {
            test.ok(false, "error:" + e.message);
        }
        test.done();
    });
}

exports.testEmpty = function (test) {
    testPath('?filter=', test, function (empValue1) {
        testPath('', test, function (empValue2) {
            if(empValue1 != empValue2) {
                test.ok(false," empty test is failed ")
            }
            test.done();
        });
    });
}

