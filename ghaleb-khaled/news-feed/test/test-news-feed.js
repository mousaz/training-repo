var http = require('http');
var server = 'http://127.0.0.1:8080/news';

//get http response from a path in the server
function dataFromPath(path, test, callback) {
    var resData = new String();
    http.get(server + path, function (res) {

        res.on('data', function (chunk) {
            resData += chunk;
        });
        res.on('end', function () {
            callback(resData);
        });
    }).on('error', function (e) {
        test.ok(false, "Error :" + e.message);
        test.done();
    });

}
//test the structure of the response
exports.testStructure = function (test) {
    dataFromPath('', test, function (feeds) {
        try {
            var news = JSON.parse(feeds).news;
            news.forEach(function (newsItem) {
                newsItem.title;
                newsItem.description;
                newsItem.link;
            });
            test.ok(true);
            test.done();
        } catch (e) {
            test.ok(false, "Error :" + e.message);
            test.done();
        }

    });
}
//check if a news item contains a word
function newsContainsWord (word, newsItem) {
    var titleIndex = newsItem.title.toUpperCase().indexOf(word);
    var descriptionIndex = newsItem.description.toUpperCase().indexOf(word);
    return titleIndex!==-1 || descriptionIndex !==-1 ;
}


//test the filtering
exports.testItem = function (test) {
    dataFromPath('', test, function (testValue) {
        try {
            var trueTitle = JSON.parse(testValue).news[0].title;
            var chosenWord = new String(trueTitle.split(' ',0));

            dataFromPath('?filter='+chosenWord,test,function (filteredValue) {

                var news = JSON.parse(filteredValue).news;
                var upperWord = chosenWord.toUpperCase();

                news.forEach(function (newsItem) {
                    test.ok(newsContainsWord(upperWord, newsItem),"filtering failed");
                });

                test.done();
            });
        } catch (e) {
            test.ok(false, "error: "+ e.message);
            test.done();
        }

    });
}
//test empty cases
exports.testEmpty = function (test) {
    dataFromPath('?filter=', test, function (empValue1) {
        dataFromPath('', test, function (empValue2) {
            test.strictEqual(empValue1, empValue2, "error on sending no parameter")
            test.done();
        });
    });
}

