var http = require('http'),
    xml2js = require('xml2js'),
    url = require("url");

//XML path paramter
var options = {
    host: 'feeds.bbci.co.uk',
    port: 80,
    path: '/news/rss.xml',
    method: 'GET'
};

//filter the tags we got
function filterNewsAttributes(extractNews) {
    var filteredNewsItem = {};
    filteredNewsItem.news = [];
	extractNews.forEach(
		function (newsItem) {
			var story = {
				title: newsItem.title,
				description: newsItem.description,
				link: newsItem.link
			};
			filteredNewsItem.news.push(story);
		}
	);
    return filteredNewsItem;
}

//parse XML into Objects
function parseToJSON(response, xmlData) {
    var parser = new xml2js.Parser({explicitArray : false});

    parser.parseString(xmlData, function (err, result) {
		if (err) {
            var error = '{statusCode: 500, message: "XML parsing failed"}';
			response.writeHead(500);
			response.end(JSON.stringify(error));
		} else {
			var filterdNewsResult = filterNewsAttributes(result.rss.channel.item);//get the items in the RSS then filter it
			response.json(filterdNewsResult);
		}
    });
}

//get XML from BBC
function process(response) {
    var xmlData = "";
    var req = http.request(options,
        function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                xmlData += chunk;
            });
            res.on('end', function () {
                //console.log(xmlData)
                parseToJSON(response, xmlData); //when XML is ready, pasre to JSON
            });
        });
    req.on('error', function (e) {
        var error = '{statusCode: 500, message: "Cant reach BBC RSS"}';
        console.log('problem with request: ' + e.message);
        response.writeHead(500, { 'Content-Type': 'text/plain'});
        response.end(JSON.stringify(error));
    });
    req.end();
}


exports.bringData = function (res) {
    process(res);
}
