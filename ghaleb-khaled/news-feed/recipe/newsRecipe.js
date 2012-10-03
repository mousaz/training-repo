var morningTime = "9:44 AM";
var eveningTime = "2:24 PM";

//return Date Object with same values as now execpt hour value
function parseDate(hour) {
    var today = new Date().toDateString();
    return new Date(today + ' ' + hour);
}

//setting first time date for scheduler
var now = new Date();
var firstMorningTime = parseDate(morningTime);
var firstEveningTime = parseDate(eveningTime);

if (firstMorningTime.getTime() < now) {
    firstMorningTime.setDate(firstMorningTime.getDate() + 1);
}
if (firstEveningTime.getTime() < now) {
    firstEveningTime.setDate(firstEveningTime.getDate() + 1);
}

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
            url: 'http://news-feed.mousaz.msproto.net/news/',
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
    name: 'dailyNewsMorningTimer',
    time: firstEveningTime.getTime(),
    interval: 'day',
    repeat: true,
    exact: true
}, getNewsData);

device.scheduler.setTimer({
    name: 'dailyEveningMorningTimer',
    time: firstMorningTime.getTime(),
    interval: 'day',
    repeat: true,
    exact: true
}, getNewsData);
