var express = require("express"),
    weatherApp = module.exports = express(),
    request = require("request"),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();
function callRequest(res, url) {
    request(url, function (error, internalRes, body) {
            console.log("inside request method .\n\n");
            if (error) {
                console.error("Error during request .\n\n");
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.end(" ERROR : The connection with  weather service " +
                    "can not be established .\n\n The ERROR is : " + error + " .");
            }
            if (internalRes.statusCode !== 200) {
                console.error("Error : status code during request .\n\n");
                res.end(" ERROR : The connection with weather service can not" +
                    " be established .\n\n  StatusCode = " + internalRes.statusCode + " .");
            }
            callParser(res, body);
        }
    );
}
function callParser(res, body) {
    parser.parseString(body, function (err, result) {
            console.log("inside parsing body .\n\n");
            if (err) {
                console.error("Error during retrieving the data .\n\n");
                res.writeHead(500, {"Content-Type": "text/plain"});
                return res.end("Error : error occurred during retrieving \n\n" +
                    "the data .\n\nError =  " + err + " .");
            }
            if (!result) {
                console.log("result is undefined .\n\n");
                return res.end(" sorry , this application " +
                    "do not support your city name .");
            }
            var weatherdata = result.weatherdata;
            if (!weatherdata) {
                console.log("weatherdata property is undefined .\n\n");
                return res.end(" sorry , this application do not " +
                    "support your city name .");
            }
            var weather = result.weatherdata.weather;
            if (!weather) {
                console.log("weather property is undefined .\n\n");
                return res.end(" sorry , this application do not " +
                    "support your city name .");
            }
            var weatherItem = result.weatherdata.weather[0];
            if (!weatherItem) {
                console.log("'0' property in weather[0] is undefined .\n\n");
                return res.end(" sorry , this application do not " +
                    "support your city name .");
            }
            var current = result.weatherdata.weather[0].current;
            if (!current) {
                console.log("current property is undefined .\n\n");
                return res.end(" sorry , this application " +
                    "do not support your city name");
            }
            var temperature = result.weatherdata.weather[0].current[0]["$"].temperature;
            var skytext = result.weatherdata.weather[0].current[0]["$"].skytext;
            var weatherObject =
            {
                temperature: temperature,
                skytext: skytext
            };
            console.log("retrieving the data is successful .\n\n");
            res.end(JSON.stringify(weatherObject));
        }
    );
}
weatherApp.get("/weather", function (req, res) {
        try {
            var location = req.query.location;
            if (!location) {
                console.log("inside location test .\n\n");
                res.writeHead(400, {"Content-Type": "text/plain"});
                res.end("Error : invalid argument , you must enter  city name \n\n" +
                    "(  city name , ex : location = ramallah )that you " +
                    "want to know about it's weather .");
            } else {
                var url = 'http://weather.partners.msn.com/find.aspx?weasearchstr=' + location;
                callRequest(res, url);
            }
        } catch (exception) {
            console.log("inside Exception .\n\n");
            res.end(" There is an exception occurred ." +
                "\n\n Exception Message : " + exception + " .");
        }
    }
);
weatherApp.listen(8890);