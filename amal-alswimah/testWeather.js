var request = require("request");

module.exports =
{
    setUp: function (callback)
    {
        callback();
    },
    tearDown: function (callback)
    {
        callback();
    },
    testDefaultWeather: function (test)
    {
        request("http://127.0.0.1:8890/weather?location=ramallah", function(error, response, body)
            {
                test.equal(error, null, "Error occurred as not expected : " + error + " .");
                test.equal(response.statusCode, 200, "Status code is not as expected : " + response.statusCode + " .");
                var weatherFeed = JSON.parse(body);
                test.ok(weatherFeed, "weatherFeed object should not refer to null");
                test.ok(weatherFeed.temperature, "the temperature property should be definedd .");
                test.ok(weatherFeed.skytext, "the skytext property should be defined .");
                test.done();
            }
        );

    },
    testInvalidWeather: function (test)
    {
        request("http://127.0.0.1:8890/weather?location=cccccccccccccaaaaaaaaaaaaaaaaabbbbbbbbbb", function(error, response, body)
            {
                test.equal(error, null, "Error occurred as not expected : " + error + " .");
                test.equal(response.statusCode, 400, "Status code is not as expected : " + response.statusCode + " .");
                var weatherFeed = JSON.parse(body);
                if (weatherFeed) {
                    test.ok(weatherFeed.statusCode, "StatusCode property should be defined .");
                    test.ok(weatherFeed.message, "Message proprty should be defined .");
                }
                test.done();
            }
        );
    },
    testIncompleteWeather: function (test)
    {
        request("http://127.0.0.1:8890/weather?location=", function(error, response, body)
            {
                test.equal(error, null, "Error occurred as not expected : " + error + " .");
                test.equal(response.statusCode, 400, "Status code is not as expected : " + response.statusCode + " .");
                var weatherFeed = JSON.parse(body);
                if (weatherFeed) {
                    test.ok(weatherFeed.statusCode, "StatusCode property should be defined .");
                    test.ok(weatherFeed.message, "Message proprty should be defined .");
                }
                test.done();
            }
        );

    }
}