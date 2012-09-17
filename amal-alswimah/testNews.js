var request = require("request");
module.exports =
{
    setUp: function (callback)
    {
        callback()
    },
    tearDown: function (callback)
    {
        callback()
    },
    newsFeedTest: function (test)
    {
        request("http://127.0.0.1:8080/news", function (error, response, body)
            {
                test.equal(error, null, "Error occurred as not expected : " + error + " .");
                test.equal(response.statusCode, 200, "Error occurred as not expected : " + response.statusCode + " .");
                var newsArray = JSON.parse(body);
                test.ok(newsArray.newsArray, "newsArray variable should not refer to null.");
                test.ok(Array.isArray(newsArray.newsArray), "the structure of ( newsArray ) variable should be an array.");
                if(newsArray.newsArray[0])
                {
                    test.ok(newsArray.newsArray[0].link, "the link property should not be undefined .");
                    test.ok(newsArray.newsArray[0].title, "the title property should not be undefined .");
                    test.ok(newsArray.newsArray[0].description, "the description property should not be undefined .");
                }
                test.done();
            }
        );
    }
}