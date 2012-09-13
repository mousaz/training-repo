var http = require('http'),
    xml2js = require('xml2js');

exports.list = function (request, response) {
    var parser = new xml2js.Parser();

    //http://jobs.ps/rss.xml
    //http://localhost:9999/jobs
    var req = http.get('http://jobs.ps/rss.xml', function (res) {
        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });
        res.on('end', function () {
            try {
                var data = new Buffer(pageData).toString();
                parser.addListener('end', function (result) {
                    try {
                        var jsonObj = [];
                        var itemsArray = result.rss.channel[0].item;
                        itemsArray.forEach(function (item) {
                            var jobs = {
                                title: item.title[0],
                                description: item.description[0],
                                pubDate: item.pubDate[0],
                                link: item.link[0]
                            };
                            jsonObj.push(jobs);
                        });
                        var finalResult = {jobs: jsonObj };
                        console.log("the data ready to send");
                        response.send(JSON.stringify(finalResult));
                        response.end("");
                    }
                    catch (e) {
                        response.statusCode = 500;
                        response.end("error at server!");
                        console.error("Got error: " + e.message);
                    }
                });
                parser.parseString(data);
            }
            catch (e) {
                response.statusCode = 500;
                response.end("error at server!");
                console.error("Got error: " + e.message);
            }
        });
    }).on('error', function(e) {
            response.statusCode = 500;
            response.end("error at server!");
            console.error("Got error: " + e.message);
        });
}
