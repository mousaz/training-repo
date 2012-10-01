var express = require("express"),
    newsApp = module.exports = express.createServer(),
    request = require("request"),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();
newsApp.get("/news", function (req, res) {
    try {
        var url = "http://feeds.bbci.co.uk/news/rss.xml";
        request(url, function (error, internalresponse, body)
        {
            if (error)
            {
                res.end(" ERROR : The connection with  ' www.feeds.bbci.co.uk ' can not be established .\n\n The ERROR is : " + error + " .");
            }
            else if(internalresponse.statusCode !== 200)
            {
                res.end(" ERROR : The connection with ' www.feeds.bbci.co.uk ' can not be established .\n\n  StatusCode = " + internalresponse.statusCode + " .");
            }
            else
            {
                parser.parseString(body, function(err, result)
                {
                    var newsItem = [];
                    var newsArray = result.rss.channel[0].item;
                    newsArray.forEach(function (oneItem)
                    {
                        newsItem.push(
                        {
                            title:oneItem.title[0],
                            link:oneItem.link[0],
                            description:oneItem.description[0]
                        });
                    } );


                    var allNewsItem =
                    {
                        newsArray:newsItem
                    };
                    res.json (allNewsItem);
                })
            }
        })}
    catch(exception)
    {
        res.end(" There is an exception occurred .\n\n Exception Message : " + exception + " .");
    }
 } )
newsApp.listen('8080');