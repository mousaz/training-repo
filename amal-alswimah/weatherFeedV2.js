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
            property = "result";
            if (!result) {
                return errorObjectPrint(res, errorObject, property);
            }
            var weatherdata = result.weatherdata;
            property = "weatherdata";
            if (!weatherdata) {
                return errorObjectPrint(res, errorObject, property);
            }
            var weather = weatherdata.weather;
            property = "weather";
            if (!weather) {
                return errorObjectPrint(res, errorObject, property);
            }
            var weatherItem = weather[0];
            property = " ' 0 ' ";
            if (!weatherItem) {
                return errorObjectPrint(res, errorObject, property);
            }
            var current = weatherItem.current;
            property = "current";
            if (!current) {
                return errorObjectPrint(res, errorObject, property);
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
function errorObjectPrint(res, errorObject, property) {
    console.log(" " + property + " property is undefined .");
    res.writeHead(400, {"Content-Type": "application/json"});
    res.end(JSON.stringify(errorObject));
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
                return res.end(JSON.stringify(errorObject));
            }
            console.log("make http request .");
            var xmlData = "";
            var options = {
                host: 'weather.partners.msn.com',
                port: 80,
                path: '/find.aspx?weasearchstr='+location,
                method: 'get'
            };
            var internalRequest = http.request(options, function(internalResponse) {
            console.log("inside http request module .");
            console.log('STATUS: ' + internalResponse.statusCode);
            console.log('HEADERS: ' + JSON.stringify(internalResponse.headers));
            internalResponse.setEncoding('utf8');
            internalResponse.on('data', function (chunck) {
                console.log("inside read data from server .");
                console.log('BODY: ' + chunck);
                xmlData += chunck;
            });
                internalResponse.on("end",function() {
                console.log("read data");
                parseToJson(res, xmlData);
                });
            });
            internalRequest.on('error', function(e) {
                console.log('problem with request: ' + e);
                res.end("error : "+e);
            });
            internalRequest.end();
        } catch (exception) {
            console.log("inside Exception .");
            res.end(" There is an exception occurred ." +
                "\n\n Exception Message : " + exception + " .");
        }
    }
);
weatherApp.listen(8890);