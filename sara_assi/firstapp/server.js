var http = require("http");
var url = require("url");
var parser = require("rssparser");
var options = {};

function start() {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

if(pathname=="/jobs"){
parser.parseURL('http://jobs.ps/rss.xml', options, function(err, out){/// this give us rss 
     //response.write(out);
 response.writeHead(200, {"Content-Type": "text/json; charset=utf-8"});
response.write(JSON.stringify(out));
   response.end(); 
});

			}
else {
	response.write("wrong path");
	   response.end();
	 }
	  response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	
	
   
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;


///////////////// wselet 3nd keef a5aleeh yetba3 3al saf7a msh 3al console