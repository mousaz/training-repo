var express=require("express");
jobApp=module.exports = express(),
request=require("request"),
xml2js = require('xml2js'),
parser = new xml2js.Parser();

jobApp.get("/news", function( req, res)
{
    try{
        var url="http://feeds.bbci.co.uk/news/rss.xml";
        request(url, function( error, internalresponse, body)
        {
            if( error)
            {
                res.end("there is an error , please try again .");
            }
            else
            if(internalresponse.statusCode!=200)
            {
                res.end("there is an error , please try again  ." + internalresponse.statusCode);
            }
            else
            {
                parser.parseString( body, function( err, result)
                {
                    var newsItemsLength = result.rss.channel[0].item.length;
                    var newsItem= [];
                    for(i=0;i<newsItemsLength;i++)
                    {
                        newsItem[i]=
                        {
                            title:result.rss.channel[0].item[i].title[0],
                            link:result.rss.channel[0].item[i].link[0],
                            description:result.rss.channel[0].item[i].description[0]
                        };
                    }
                    var jO=
                    {
                        newsArray:newsItem
                    };
                    res.writeHead(200, {"Content-Type": "application/json; charset=UTF-8"});
                    res.write(" "+JSON.stringify(jO));
                    res.end();
                })
            }
        })}
    catch(exception)
    {
        res.end("there is an error , please try again .");
    }
})
jobApp.listen('8080');
