var request = require("request");
module.exports=
{
    setUp:function(callback){callback()},
    tearDown:function(callback){callback()},
    test1:function(test)
    {
        request("http://127.0.0.1:8080/news", function(error, response, body){
        test.ok(true);
        test.equal(error, null, "error1");
        test.equal(response.statusCode, 200, "error2");
        var jO=JSON.parse(body);
        test.notEqual(jO.newsArray, null, "error3");
        test.equal(Array.isArray(jO.newsArray), true, "error4");
        test.notEqual(jO.newsArray[0].link, undefined, "error5");
        test.notEqual(jO.newsArray[0].title, undefined, "error6");
        test.notEqual(jO.newsArray[0].description, undefined, "error7");
        test.done();})

    }
}