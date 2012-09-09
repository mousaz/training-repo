var http = require('http');
var xml2js = require('xml2js');
exports.list = function (req1, res1) {
    var parser = new xml2js.Parser ();
    parser.on('end', function (result) {
        eyes.inspect(result);
    });
    var req = http.get('http://jobs.ps/rss.xml', function (res) {
        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });
        res.on('end', function () {
            var data = new Buffer(pageData).toString();
            var parser = new xml2js.Parser();
            parser.addListener('end', function (result) {
                var jsonObj = [];
                var itemsArray = result['channel'].item;
                itemsArray.forEach(function (item) {
                    var title = item.title;
                    var Description = item.description;
                    var PubDate = item.pubDate;
                    var link = item.link;
                    jsonObj.push({"title":title, "link":link, "description":Description, "publishDate":PubDate});
                });
                var jsonR = {"jobs":jsonObj};
                console.log("it work");
                res1.send(jsonR);
            });
            parser.parseString(data);
        });
    });
};

