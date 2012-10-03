var hours = 9,
  minutes = 14,
  now = new Date(),
  timerStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0),
  sendNewsTimeReminder = function () {
    device.ajax({
        url: 'http://news-feed.dimash.msproto.net/news',
        type: 'GET',
        headers: {
          'Content-Type': 'application/JSON'
        }
      },
      function onSuccess(body, textStatus, response) {
        var parsedBody;
        if(!(body && (parsedBody = JSON.parse(body)))) {
          var error = {};
          error.message = 'invalid body format';
          error.content = body;
          console.error('error: ',error);

        } else {
          parsedBody = JSON.parse(body);
          for(var i=0;i<3;i++) {
            var title = parsedBody.news[i].title;
            var reminder = device.notifications.createNotification('It\'s news time');
            reminder.content = title;
            reminder.on('click', function() {
              var messageBox = device.notifications.createMessageBox('More Info about ' + title);
              messageBox.contents = 'Would you like to know about '+ title;
              messageBox.buttons = ['Yes','No'];
              messageBox.on('Yes', function() {
                device.browser.launch(parsedBody.news[i].link);

              } );
              messageBox.show();
            } );
            reminder.show();

          }

        }

      },
      function onError(textStatus, response) {
        var error = {};
        error.message = textStatus;
        error.statusCode = response.status;
        console.error('error: ', error);
      } );
  };
device.scheduler.setTimer({
    name: 'dailyNewsTimer',
    time: timerStart.getTime(),
    interval: 'day',
    repeat: true,
    exact: true
  },
  sendNewsTimeReminder);