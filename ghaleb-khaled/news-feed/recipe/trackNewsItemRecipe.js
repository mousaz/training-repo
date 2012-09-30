var period = "3"; // in minutes
var filter = "Man";

var firstTime = new Date();
firstTime.setMinutes(firstTime.getMinutes() + parseInt(period));


//display the news on client mobile
function showNews(news) {
    news.forEach(function (newsItem) {
        var notification = device.notifications.createNotification(newsItem.title);
        notification.content = newsItem.description;
        notification.on('click',
            function () {
                var messageBox = device.notifications.createMessageBox(newsItem.title);
                messageBox.content =newsItem.description;
                messageBox.buttons = [ 'Show', 'Hide' ];

                messageBox.on('Show', function () {
                    device.browser.launch(newsItem.link);
                });
                messageBox.show();
            });
        notification.show();
    });
}


//getting news-feed from the webservice
function getNewsData() {
    var news;
    device.ajax(
        {
            url: 'http://news-feed.mousaz.msproto.net/news?filter=' + filter,
            type: 'GET',
            headers: {
                'Content-Type': 'application/xml'
            }
        },
        function onSuccess(body, textStatus, response) {
            if (!(body && (news = JSON.parse(body).news))) {
                var error = {};
                error.message = 'invalid body format';
                error.content = body;
                console.error('error: ',error);
            } else {
                showNews(news);
            }
        },
        function onError(textStatus, response) {
            var error = {};
            error.message = textStatus;
            error.statusCode = response.status;
            console.error('error: ', error);
        }
    );
}

//setting schedulers
device.scheduler.setTimer({
    name: 'NewsTracker',
    time: firstTime.getTime(),
    interval: period * 60 * 1000,
    repeat: true,
    exact: true
}, getNewsData);