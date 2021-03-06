var express = require("express"),
  weatherApp = module.exports = express.createServer(),
  request = require("request"),
  xml2js = require('xml2js'),
  parser = new xml2js.Parser();
  docRouter = require("docRouter").DocRouter;
function getWeatherInfo(res, url) {
  request(url, function (error, internalRes, body) {
      console.log("inside request method .");
      if (error) {
        console.error("Error during request .");
        var errorObject =
        {
          statusCode:500,
          message:" ERROR : The connection with  weather service " +
            "can not be established .The ERROR is : " + error + " ."
        }
        res.writeHead(500, {"Content-Type":"application/json"});
        res.end(JSON.stringify(errorObject));
      }
      if (internalRes.statusCode !== 200) {
        console.error(" Error from weather service .Status code = " + internalRes.statusCode + " .");
        var errorObject =
        {
          statusCode:500,
          message:" ERROR : The connection with weather service can not" +
            " be established . StatusCode = " + internalRes.statusCode + " ."
        }
        res.writeHead(500, {"Content-Type":"application/json"});
        res.end(JSON.stringify(errorObject));
      }
      parseToJson(res, body);
    }
  );
}
function parseToJson(res, body) {
  parser.parseString(body, function (err, result) {
      console.log("inside parsing body .");
      if (err) {
        console.error("Error happened during parsing the body .");
        var errorObject =
        {
          statusCode:500,
          message:"Error : error occurred during retrieving \n\n" +
            "the data .Error =  " + err + " ."
        }
        res.writeHead(500, {"Content-Type":"application/json"});
        return res.end(JSON.parse(errorObject));
      }
      var errorObject =
      {
        statusCode:400,
        message:" sorry , this application " +
          "does not support your city name ."
      }
      if (!result) {
        console.log("result is undefined .");
        res.writeHead(400, {"Content-Type":"application/json"});
        return res.end(JSON.stringify(errorObject));
      }
      var weatherdata = result.weatherdata;
      if (!weatherdata) {
        console.log("weatherdata property is undefined .");
        res.writeHead(400, {"Content-Type":"application/json"});
        return res.end(JSON.stringify(errorObject));

      }
      var weather = weatherdata.weather;
      if (!weather) {
        console.log("weather property is undefined .");
        res.writeHead(400, {"Content-Type":"application/json"});
        return res.end(JSON.stringify(errorObject));
      }

      var weatherItem = weather[0];
      if (!weatherItem) {
        console.log("'0' property in weather[0] is undefined .");
        res.writeHead(400, {"Content-Type":"application/json"});
        return res.end(JSON.stringify(errorObject));

      }
      var current = weatherItem.current;
      if (!current) {
        console.log("current property is undefined .");
        res.writeHead(400, {"Content-Type":"application/json"});
        return res.end(JSON.stringify(errorObject));

      }
      var temperature = result.weatherdata.weather[0].current[0]["$"].temperature;
      var skytext = result.weatherdata.weather[0].current[0]["$"].skytext;
      var weatherObject =
      {
        temperature:temperature,
        skytext:skytext
      };
      console.log("retrieving the data is successful .");
      res.end(JSON.stringify(weatherObject));
    }
  );
}
weatherApp.use("/weather", docRouter(express.router, "/weather", function (app) {
  console.log("inside use method .");
  app.get("/", function (req, res) {
      console.log("inside < / >  path");
      try {
        var location = req.query.location;
        if (!location) {
          console.log("inside location test .");
          res.writeHead(400, {"Content-Type":"application/json"});
          var errorObject =
          {
            statusCode:400,
            message:"Error : invalid argument , you must enter  city name " +
              "(  city name , ex : location = ramallah )that you " +
              "want to know about it's weather ."
          }
          res.end(JSON.stringify(errorObject));
        } else {
          var url = 'http://weather.partners.msn.com/find.aspx?weasearchstr=' + location;
          getWeatherInfo(res, url);
        }
      } catch (exception) {
        console.log("inside Exception .");
        res.end(" There is an exception occurred ." +
          "\n\n Exception Message : " + exception + " .");
      }
    }
    ,
    {
      id:"Weather",
      doc:"It returns temperature and skytext information for a given location.",
      params:{
        location:{
          style:"query",
          type:"string",
          required:true,
          description:"Query Location may be city, country "
        }
      },
      response:{
        representations:["application/json"]
      }
    });
}));
weatherApp.listen(8890);