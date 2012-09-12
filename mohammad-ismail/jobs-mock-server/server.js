
var express = require("express"),
  path = require("path"),
  http = require("http"),
  server = express();


server.configure(function () {
  server.set("port", 9999);
  server.use(express.static(path.join(__dirname, "static")));
});

http.createServer(server).listen(server.get("port"), function () {
  console.log("Jobs Mock Server listening on port " + server.get("port"));
});
