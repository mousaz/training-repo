var http = require('http');
var server = 'http://127.0.0.1:8080/news';


exports.testItem = function (test) {
    var resData = "";
    var trueValue = "Soldier has baby in Afghanistan";
    http.get(server + '?filter=Afghanistan', function (res) {

        res.on('data', function (chunk) {
            resData += chunk;
        });
        res.on('end', function () {
            var newsFeed = JSON.parse(resData);
            test.equal(newsFeed.news[0].title, trueValue, "retrieved data is not valid");
            test.done();
        });
    }).on('error', function (e) {
        test.ok(false, "request failed")
        test.done();
    });

}