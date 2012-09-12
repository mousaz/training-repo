var express = require("express"),
    newsApp = module.exports = express(),
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
                res.end(" ERROR : The connection with  ' www.feeds.bbci.co.uk ' can not be established .");
            }
            else if(internalresponse.statusCode !== 200)
            {
                res.end(" ERROR : The connection with ' www.feeds.bbci.co.uk ' can not be established .\n\n  StatusCode = " + internalresponse.statusCode);
            }
            else
            {
                parser.parseString(body, function(err, result)
                {
                    var newsItem = [];
                    (result.rss.channel[0].item).forEach(function (oneItem)
                    {
                        oneItem =
                        {
                            title:oneItem.title[0],
                            link:oneItem.link[0],
                            description:oneItem.description[0]
                        };
                        newsItem.push(oneItem)
                    } )


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
        res.end(" An exception occurred while establishing connection .\n\n Exception type is : "+exception+" .");
    }
 } )
newsApp.listen('8080');