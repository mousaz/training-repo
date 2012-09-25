device.scheduler.setTimer({
        name: "jobfeedTest",
        time: 0,
        interval: 30*60*1000,
        exact: false },
    function () {
        device.ajax(
            {
                url: 'http://jobs-feed.mousaz.msproto.net/jobs?filter=Assistant',
                type: 'GET'
            },
            function onSuccess(body, textStatus, response) {
                var parsedBody;
                if(!(body && (parsedBody = JSON.parse(body)))) {
                    var error = {};
                    error.message = 'invalid body format';
                    error.content = body;
                    return console.error('error: ',error);
                }
                if(!parsedBody.jobs[0].title){
                    var error = {};
                    error.message = 'no mach job found';
                    error.content = body;
                    return console.log('log: ',error.message);
                }
                var JobTiltleString = "";
                var title = parsedBody.jobs[0].title;
                parsedBody.jobs.forEach(function (item,index) {
                    JobTiltleString = JobTiltleString + ''+ ++index +": " + item.title + "\n";
                });
                console.info('successfully received http response!');
                var notification = device.notifications.createNotification('Job search result');
                notification.content = ' jobs is found '+parsedBody.jobs.length;
                notification.on('click', function() {
                    ////////////////////////////////////
                    var messageBox = device.notifications.createMessageBox('More info');
                    messageBox.content = JobTiltleString;
                    messageBox.buttons = ['SET # of Job','cancel'];
                    messageBox.on('SET # of Job', function() {
                        var inputBox1 = device.notifications.createInputBox('Job Name');
                        inputBox1.content = 'Please  the Job title :';
                        inputBox1.type = 'number';
                        inputBox1.buttons = [ 'Go' ];
                        inputBox1.on('Go', function() {
                            device.browser.launch(parsedBody.jobs[--inputBox1.value].link);

                        });
                        inputBox1.show();});
                    messageBox.show();
                });
                notification.show();
            },
            function onError(textStatus, response) {
                var error = {} ;
                error.message = textStatus;
                error.statusCode = response.status;
                console.error('error: ',error);
            });
    }
);
