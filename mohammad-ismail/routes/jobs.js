var fs = require('fs')
http=require('http')
sys=require('sys')
fs = require('fs')
xml2js=require('xml2js')
exports.list = function(req1, res1){
    var parser = new xml2js.Parser();

    parser.on('end', function(result) {
        eyes.inspect(result);
    });

    //Tell the request that we want to fetch youtube.com, send the results to a callback function


    var req = http.get('http://jobs.ps/rss.xml', function(res) {


        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });

        res.on('end', function(){
            var data=new Buffer(pageData).toString();
            var parser=new xml2js.Parser();
            parser.addListener('end', function(result) {
                var jsonObj = [];
                var itemsArray=result["channel"].item;
             for (var i=0;i<result["channel"].item.length;i++){
                 var title=result["channel"].item[i].title;
                 var Description=result["channel"].item[i].description;
                 var PubDate=result["channel"].item[i].pubDate;
                 var link=result["channel"].item[i].link;
                 jsonObj.push({"title": title,"link":link, "Description": Description,"publishDate":PubDate});
                 }
                //var jsonR=haveJson(itemsArray,jsonObj);
                var jsonR={"jobs":jsonObj};

                console.log("it work");
                res1.send(jsonR);

            });
            parser.parseString(data);
        });
    });
};


/*
function haveJson(itemsArray1,jasonResult){
    console.log(itemsArray1);
    var item=itemsArray1;
    if(item.length==0)return jasonResult;
    else{
        console.log(item);
        var title=item[item.length-1].title;
        var Description=item[item.length-1].description;
        var PubDate=item[item.length-1].pubDate;
        var link=item[item.length-1].link;
        jasonResult.push({"title": title,"link":link, "Description": Description,"publishDate":PubDate});
        item.pop();
        return haveJson(item,jasonResult);

    }
}
*/

