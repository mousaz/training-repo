var requestModule = require('request'),
    xml2js = require('xml2js');
exports.list = function (request, response) {
    var parser = new xml2js.Parser();
    var queryIndex = request.query;
    request.setEncoding('utf-8');
    requestModule.get('http://jobs.ps/rss.xml', function (error, res, body) {
        if (error || res.statusCode !== 200) {
            response.statusCode = 500;
            var errorMassage = {statusCode: 500, message: "error at server"};
            response.statusCode = 500;
            return response.end(JSON.stringify(errorMassage));
        }
        try {
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
                    return response.end(JSON.stringify(finalResult));
                }
                catch (e) {
                    console.error("Got error: " + e.message);
                    response.statusCode = 500;
                    return response.end(JSON.stringify({ statusCode: 500, message: "error at server" }));

                }
            });
            parser.parseString(body);
        }
        catch (e) {
            console.error("Got error: " + e.message);
            response.statusCode = 500;
            return response.end(JSON.stringify({ statusCode: 500, message: "error at server" }));
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