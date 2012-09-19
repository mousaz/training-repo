var requestJobs = require('request'),
    xml2js = require('xml2js');
exports.list = function (request, response) {
    var parser = new xml2js.Parser();
    var queryIndex = request.query;
    request.setEncoding('utf-8');
    requestJobs.get('http://jobs.ps/rss.xml', function (error, res, body) {
        if (!error && res.statusCode === 200) {

            try {
                var data = new Buffer(body).toString();
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
                        if (queryIndex.filter) {
                            jsonObj = filterData(queryIndex, jsonObj);
                        }
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
        }
        else{
            response.statusCode = 500;
            response.end("error at server!");
        }
    });
};

exports.filter = filterData = function (query, jsonArray) {
    var jsonArrayBuffer = [];
    jsonArray.forEach(function (item) {
        var queryLower = query.filter.toLowerCase();
        if ( item.title.toLowerCase().indexOf(queryLower) > -1 ||
            item.description.toLowerCase().indexOf(queryLower) > -1 ) {
            jsonArrayBuffer.push(item);
        }
    });
    return jsonArrayBuffer;
};
