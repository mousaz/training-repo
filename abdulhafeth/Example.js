var http = require('http');
var https = require('https');


http.createServer(function (req, res) {
    //create the geo long/lat path
    console.log(req.url.split("/"));
    var url;
    if (req.url.split("/")[1].localeCompare("favicon.ico") != 0) {
        if (req.url.split("/").length == 3 && req.url.split("/")[1] != null && !isNaN(req.url.split("/")[1] - 0) && req.url.split("/")[2] != null && !isNaN(req.url.split("/")[2] - 0)) {
//            var ip_address = null;
//
//            try {
//                if (req.headers['x-forwarded-for'] != null)
//                    ip_address = req.headers['x-forwarded-for'];
//                else
//                    ip_address = req.connection.remoteAddress;
//            }
//            catch (error) {
//                ip_address = req.connection.remoteAddress;
//            }

            url = ["/v2/venues/search?ll=" + req.url.split("/")[1] + "," + req.url.split("/")[2] + "&&limit=50&&oauth_token=3TXOU3W43XZSLRMWRQ2FHYFWBMEWS3E1GQJGPIPYDYYZ4F2D&&categoryId=4d4b7105d754a06374d81259"].join("");
           var options = {host:"api.foursquare.com", path:url, port:443};

            var reg = https.get(options, function (response) {
                var pageData = "";
                var resturantsItems = {};
                resturantsItems.resturant = [];
                var jsonData = "";
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    pageData += chunk;
                });
                response.on('end', function () {
                    var json = JSON.parse(pageData);
//                console.log(Object.getOwnPropertyNames(json.response.groups[0].items[0]));//.categories[0].parents[0]);
                    var length = json.response.groups.length;
                    for (var i = 0; i < length; i++) {
                        var length2 = json.response.groups[i].items.length;
                        for (var j = 0; j < length2; j++) {
                            if (json.response.groups[i].items[j].categories[0].parents[0].localeCompare("Food") == 0) {
                                var data = {
                                    name:json.response.groups[i].items[j].name,
                                    link:json.response.groups[i].items[j].url,
                                    contact:json.response.groups[i].items[j].contact
                                };
                                console.log(json.response.groups[i].items[j].categories[0].parents[0]);
                                resturantsItems.resturant.push(data);

                                jsonData += json.response.groups[i].items[j];
                            }
                        }
                    }
                    res.writeHead(2000, { 'Content-Type':'application/json'});
                    res.seten
                    res.write(JSON.stringify(resturantsItems));
                    res.end();
                });

            });

            req.on('error', function (e) {
                var error = '{statusCode: 500, message: "Cant reach foursquare service"}';
                console.log('problem with request: ' + e.message);
            });
        } else {
            var bingUrl = "";
            if (req.url.split("/").length == 2) {
                bingUrl = ["/REST/v1/Locations/" + req.url.split("/")[1] + "/-/-/-?o=json&key=AiA_qu6RdClWt_sGmtb49flSJvCeKBc-hSOFlYfydQ9_hvvpiEfvYipcHjMvod8B"].join("");
            }
            else if (req.url.split("/").length == 3) {
                bingUrl = ["/REST/v1/Locations/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/-/-?o=json&key=AiA_qu6RdClWt_sGmtb49flSJvCeKBc-hSOFlYfydQ9_hvvpiEfvYipcHjMvod8B"].join("");
            } else if (req.url.split("/").length == 4) {
                bingUrl = ["/REST/v1/Locations/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3] + "/-?o=json&key=AiA_qu6RdClWt_sGmtb49flSJvCeKBc-hSOFlYfydQ9_hvvpiEfvYipcHjMvod8B"].join("");
            } else if (req.url.split("/").length == 5) {
                bingUrl = ["/REST/v1/Locations/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3] + "/" + req.url.split("/")[4] + "?o=json&key=AiA_qu6RdClWt_sGmtb49flSJvCeKBc-hSOFlYfydQ9_hvvpiEfvYipcHjMvod8B"].join("");
            } else if (req.url.split("/").length == 6) {
                bingUrl = ["/REST/v1/Locations/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3] + "/" + req.url.split("/")[4] + "/" + req.url.split("/")[5] + "?o=json&key=AiA_qu6RdClWt_sGmtb49flSJvCeKBc-hSOFlYfydQ9_hvvpiEfvYipcHjMvod8B"].join("");
            }
            var lat = "";
            var long = "";
            options = {host:"dev.virtualearth.net", path:bingUrl};
            var reg = http.get(options, function (response) {
                var bingData = "";
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    bingData += chunk;
                });

                response.on('end', function () {
                    var bingJson = JSON.parse(bingData);
                    lat = bingJson.resourceSets[0].resources[0].point.coordinates[0];
                    long = bingJson.resourceSets[0].resources[0].point.coordinates[1];
                    url = ["/v2/venues/search?ll=" + lat + "," + long + "&&limit=50&&oauth_token=3TXOU3W43XZSLRMWRQ2FHYFWBMEWS3E1GQJGPIPYDYYZ4F2D&&categoryId=4d4b7105d754a06374d81259"].join("");
                    options = {host:"api.foursquare.com", path:url, port:443};
                    var reg = https.get(options, function (response) {
                        var pageData = "";
                        var resturantsItems = {};
                        resturantsItems.resturant = [];
                        var jsonData = "";
                        response.on('data', function (chunk) {
                            pageData += chunk;
                        });

                        response.on('end', function () {
                            var json = JSON.parse(pageData);
//                console.log(Object.getOwnPropertyNames(json.response.groups[0].items[0]));//.categories[0].parents[0]);
                            var length = json.response.groups.length;
                            for (var i = 0; i < length; i++) {
                                var length2 = json.response.groups[i].items.length;
                                for (var j = 0; j < length2; j++) {
                                    if (json.response.groups[i].items[j].categories[0].parents[0] != null && json.response.groups[i].items[j].categories[0].parents[0].localeCompare("Food") == 0) {
                                        var data = {
                                            name:json.response.groups[i].items[j].name,
                                            link:json.response.groups[i].items[j].url,
                                            contact:json.response.groups[i].items[j].contact
                                        };
                                        console.log(json.response.groups[i].items[j].categories[0].parents[0]);
                                        resturantsItems.resturant.push(data);
                                        jsonData += json.response.groups[i].items[j];
                                    }
                                }
                            }
                            res.writeHead(2000, { 'Content-Type':'application/json'});
                            res.write(JSON.stringify(resturantsItems));
                            res.end();
                        });
                    });
                    req.on('error', function (e) {
                        var error = '{statusCode: 500, message: "Cant reach foursquare service"}';
                        console.log('problem with request: ' + e.message);
                        //        response.writeHead(500, { 'Content-Type': 'application/json'});
                        //        response.end(JSON.stringify(error));
                    });
                });
            });
        }
    }

}).listen(8080);




