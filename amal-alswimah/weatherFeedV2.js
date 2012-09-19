var express = require("express"),
    weatherApp = module.exports = express(),
    http = require("http"),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();
function parseToJson(res, body) {
    parser.parseString(body, function (err, result) {
            console.log("inside parsing body .");
            if (err) {
                console.error("Error happened during parsing the body .");
                var errorObject =
                {
                    statusCode: 500,
                    message: "Error : error occurred during retrieving \n\n" +
                        "the data .\n\nError =  " + err + " ."
                }
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end(JSON.parse(errorObject));
            }
            var errorObject =
            {
                statusCode: 400,
                message: " sorry , this application " +
                    "does not support your city name ."
            }
            if (!result) {
                console.log("result is undefined .");
                res.writeHead(400, {"Content-Type": "application/json"});
                return res.end(JSON.stringify(errorObject));
            }
            var weatherdata = result.weatherdata;
            if (!weatherdata) {
                console.log("weatherdata property is undefined .");
                res.writeHead(400, {"Content-Type": "application/json"});
                return res.end(JSON.stringify(errorObject));

            }
            var weather = weatherdata.weather;
            if (!weather) {
                console.log("weather property is undefined .");
                res.writeHead(400, {"Content-Type": "application/json"});
                return res.end(JSON.stringify(errorObject));
            }

            var weatherItem = weather[0];
            if (!weatherItem) {
                console.log("'0' property in weather[0] is undefined .");
                res.writeHead(400, {"Content-Type": "application/json"});
                return res.end(JSON.stringify(errorObject));

            }
            var current = weatherItem.current;
            if (!current) {
                console.log("current property is undefined .");
                res.writeHead(400, {"Content-Type": "application/json"});
                return res.end(JSON.stringify(errorObject));

            }
            var temperature = result.weatherdata.weather[0].current[0]["$"].temperature;
            var skytext = result.weatherdata.weather[0].current[0]["$"].skytext;
            var weatherObject =
            {
                temperature: temperature,
                skytext: skytext
            };
            console.log("retrieving the data is successful .");
            res.end(JSON.stringify(weatherObject));
        }
    );
}
weatherApp.get("/weather", function (req, res) {
        try {
            var location = req.query.location;
            if (!location) {
                console.log("inside location test .");
                res.writeHead(400, {"Content-Type": "application/json"});
                var errorObject =
                {
                    statusCode: 400,
                    message: "Error : invalid argument , you must enter  city name \n\n" +
                        "(  city name , ex : location = ramallah )that you " +
                        "want to know about it's weather ."
                }
                res.end(JSON.stringify(errorObject));
            } else {
                console.log("make http request .");
                var xmlData = "";
                var options = {
                    host: 'weather.partners.msn.com',
                    port: 80,
                    path: '/find.aspx?weasearchstr='+location,
                    method: 'get'
                };
                var req1 = http.request(options, function(res1) {
                    console.log("inside http request module .");
                    console.log('STATUS: ' + res1.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res1.headers));
                    res1.setEncoding('utf8');
                    res1.on('data', function (chunck) {
                        console.log("inside read data from server .");
                        console.log('BODY: ' + chunck);
                        xmlData += chunck;
                    });
                    res1.on("end",function() {
                        console.log("read data");
                        parseToJson(res, xmlData);
                        res.end(xmlData);
                    });
                });
                req1.on('error', function(e) {
                    console.log('problem with request: ' + e);
                    res.end("error : "+e);
                });
                req1.end();

            }
        } catch (exception) {
            console.log("inside Exception .");
            res.end(" There is an exception occurred ." +
                "\n\n Exception Message : " + exception + " .");
        }
    }
);
weatherApp.listen(8890);