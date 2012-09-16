var http = require('http'),
//url = require('')
    xml2js = require('xml2js');
exports.list = function (request, response) {
    var parser = new xml2js.Parser();
    var queryIndex = request.query;
    var req = http.get('http://localhost:9999/jobs.xml', function (res) {
        var pageData = "";
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
                        var jsonArray = filterData(queryIndex,jsonObj);
                        var finalResult = {jobs: jsonArray };
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



exports.filter = filterData= function (query,jsonArray) {
    if (query.filter == undefined) {
        return jsonArray;
    }
    else if (query.filter == 'engineer' || query.filter == 'Engineer') {
        var jsonArrayBuffer = [];
        jsonArray.forEach(function (item) {
            if (item.title.indexOf('Engineer') > -1 || item.description.indexOf('Engineer') > -1) jsonArrayBuffer.push(item);
            else if (item.title.indexOf('engineer') > -1 || item.description.indexOf('engineer')>-1) jsonArrayBuffer.push(item);
        });
        return jsonArrayBuffer;
    }
    else if (query.filter !=undefined && query.filter !=="Engineer"&&query.filter !="engineer") {
        var jsonArrayBuffer=[];
        jsonArray.forEach(function (item) {
            if(item.title.indexOf(query.filter.toString())>-1 || item.description.indexOf(query.filter.toString())>-1)jsonArrayBuffer.push(item);
        });
        return jsonArrayBuffer;


    }
}
