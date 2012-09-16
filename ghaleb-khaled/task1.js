var http = require('http'),
	xml2js = require('xml2js');
var http = require('http');
var url = 	require("url");


var options = {
  host: 'feeds.bbci.co.uk',
  port: 80,
  path: '/news/rss.xml',
  method: 'GET'
};

http.createServer(function (req, res) {
	var pathName = url.parse(req.url).pathname;
	if(pathName == "/news")
		process(res);
  
}).listen(8080);

//get XML from BBC
function process(response){
	var xmlData="";
	response.writeHead(200, {'Content-Type': 'text/plain'});
	var req = http.request(options, 
	function (res) {
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
			xmlData+=chunk;
		  });
		res.on('end',function (){
			parseToJSON(response,xmlData);
		});
	});	
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});		
	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();
}


function parseToJSON(response,xmlData){
	var parser = new xml2js.Parser( {explicitArray : false} );
	parser.parseString(xmlData, function (err, result) {
		var temp = rebuilt(result.rss.channel.item);
		response.end(JSON.stringify(temp));//
		for(var propertyName in temp) {
			// propertyName is what you want
			// you can get the value like this: myObject[propertyName]
			console.log(propertyName);
		}
		
	});
}

function rebuilt(obj){
	var newObj={};
	newObj.news = [];
	
	for(var id in obj){
		var tempObj={};
		tempObj.title = obj[id].title
		tempObj.description=obj[id].description
		tempObj.link = obj[id].link
		newObj.news.push(tempObj);
	}
	return newObj;
}
