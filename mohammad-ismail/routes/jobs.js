var fs = require('fs')
    ,http=require('http')
    ,xml2js=require('xml2js')
exports.list = function(request, response){
    var parser = new xml2js.Parser();
    try{
        var req = http.get('http://jobs.ps/rss.xml', function(res) {
            var pageData = "";
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                pageData += chunk;
            });
            res.on('end', function(){
                var data=new Buffer(pageData).toString();
                parser.addListener('end', function(result) {
                    var jsonObj = [];
                    var itemsArray=result.channel.item;
                    itemsArray.forEach(function(item){
                        var jobs={
                            title: item.title
                            , Description: item.description
                            , PubDate: item.pubDate
                            , link : item.link};
                        jsonObj.push(jobs);
                    });
                    var finalResult={"jobs":jsonObj};
                    console.log("it work");
                    response.send(JSON.stringify(finalResult));
                });
                parser.parseString(data);
            });
        });}catch (ex){response.end("there is an error");}
};

