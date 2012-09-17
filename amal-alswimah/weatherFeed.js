var express = require("express"),
    weatherApp = module.exports = express(),
    docRouter = require("docrouter").DocRouter,
    request = require("request"),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();
weatherApp.get("/weather", function (req, res)
    {
        try{
        var location = req.query.location;

        if(!location)
        {

            res.end("there is an error, you must enter  city name (  city name , ex : location = ramallah )that you want to know about it's weather .");
        }
        else
        {

            var url = 'http://weather.partners.msn.com/find.aspx?weasearchstr=' + location;
            request(url, function (error, internalRes, body)
                {

                    if(error)
                    {
                        res.end(" ERROR : The connection with  ' www.weather.partners.msn.com ' can not be established .\n\n The ERROR is : " + error + " .");
                    }
                    if(internalRes.statusCode != 200)
                    {
                        res.end(" ERROR : The connection with ' www.weather.partners.msn.com ' can not be established .\n\n  StatusCode = " + internalresponse.statusCode + " .");
                    }
                    else
                    {
                        parser.parseString(body, function (err, result)
                        {
                            if(!result)
                            {
                                res.end(" sorry , this application do not support your city name");
                            }
                            else
                            {
                                if(!result.weatherdata)
                                {
                                    res.end(" sorry , this application do not support your city name");
                                }

                                else{
                                    if(!result.weatherdata.weather)
                                    {
                                        res.end(" sorry , this application do not support your city name");
                                    }
                                    else{
                                        if(!result.weatherdata.weather[0])
                                        {
                                            res.end(" sorry , this application do not support your city name");
                                        }
                                        else
                                        {
                                            if(!result.weatherdata.weather[0].current)
                                            {
                                                res.end(" sorry , this application do not support your city name");
                                            }
                                            else
                                            {
                                                var t = result.weatherdata.weather[0].current[0]["$"].temperature;
                                                var s = result.weatherdata.weather[0].current[0]["$"].skytext;
                                                var aboutWeather =
                                                {
                                                    temperature:t,
                                                    skytext:s
                                                };
                                                var cityWeather =
                                                {
                                                    cityWeather:aboutWeather
                                                }
                                                res.end(JSON.stringify(cityWeather));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        );
                    }
                     }
            );
        }
        }
        catch(exception)
        {
            res.end(" There is an exception occurred .\n\n Exception Message : " + exception + " .");
        }
    }
);
weatherApp.listen(8890);