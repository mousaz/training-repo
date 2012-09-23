var http = require('http');
var server = 'http://127.0.0.1:8080/news';

//get http response from a path in the server
function dataFromPath(path, test, callback) {
    var resData = new String();
    http.get(server + path, function (res) {

        res.on('data', function (chunk) {
            resData += chunk;
        });
        res.on('end', function () {
            callback(resData);
        });
    }).on('error', function (e) {
            test.ok(false, "Error :" + e.message);
            test.done();
        });

}
//the the structure of the response
exports.testStructure = function (test) {
    dataFromPath('', test, function (feeds) {
        try {
            var news = JSON.parse(feeds).news;
            news[0].title;
            news[0].description;
            news[0].link;
            test.done();
        } catch (e) {
            test.ok(false, "Error :" + e.message);
            test.done();
        }

    });
}
//test the filtering
exports.testItem = function (test) {
    dataFromPath('', test, function (testValue) {
        try {
            var trueTitle = JSON.parse(testValue).news[0].title
            dataFromPath('?filter='+trueTitle.split(' ',0),test,function (filteredValue) {
                test.strictEqual(trueTitle,JSON.parse(filteredValue).news[0].title,"filtering failed");
                test.done();
            });
        } catch (e) {
            test.ok(false, "error: "+ e.message);
            test.done();
        }

    });
}
//test empty cases
exports.testEmpty = function (test) {
    dataFromPath('?filter=', test, function (empValue1) {
        dataFromPath('', test, function (empValue2) {
            test.strictEqual(empValue1, empValue2, "error on sending no parameter")
            test.done();
        });
    });
}

