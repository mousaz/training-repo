/**
 * Created with JetBrains WebStorm.
 * User: gkhaled
 * Date: 9/16/12
 * Time: 2:41 PM
 * To change this template use File | Settings | File Templates.
 */
var http	=	require('http'),
    xml2js	=	require('xml2js'),
    url		=	require("url");

//XML path paramter
var options = {
    host: 'feeds.bbci.co.uk',
    port: 80,
    path: '/news/rss.xml',
    method: 'GET'
};

//filter the tags we got
function rebuilt(obj) {
    var newObj = {};
    newObj.news = [];

    for (var id in obj) {
        var tempObj={};
        tempObj.title = obj[id].title
        tempObj.description=obj[id].description
        tempObj.link = obj[id].link
        newObj.news.push(tempObj);
    }
    return newObj;
}

//parse XML into Objects
function parseToJSON(response,xmlData) {
    var parser = new xml2js.Parser( {explicitArray : false} );

    parser.parseString(xmlData, function (err, result) {
        var temp = rebuilt( result.rss.channel.item );//get the items in the RSS then filter it
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(temp));
    });
}

//get XML from BBC
function process(response) {
    var xmlData="";
    var req = http.request(options,
        function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                xmlData += chunk;
            });
            res.on('end', function () {
                //console.log(xmlData)
                parseToJSON(response,xmlData); //when XML is ready, pasre to JSON
            });
        });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        response.writeHead(500, {
            'Content-Length': body.length,
            'Content-Type': 'text/plain' });
        response.end();
    });
    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
}


exports.bringData= function (res) {
    process(res);
}

