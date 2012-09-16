# Training Repository
The purpose of this repository is to be a practical enviornment for training. 


The anode 10 second rules:

 * 10 seconds from `git push` to the cloud
 * 10 seconds to run all tests for all apps
 * 10 seconds to see a log line

Some of the things we think can help with that goal are:

 * Git push < 30sec deployment to 100s of instances
 * Don't care about servers: apps scale elasticly on the farm (much better utilization of resources)
 * Isolate prod and dev with branches and subdomains (foo.msproto.net -> master branch, foo.xxx.msproto.net -> xxx branch)
 * Continuous testing in the cloud when merging into `master` via a github pull request
 * Extreme developer visibility: real-time logging, daily app status mails, alerts on errors, statistics
 * Zero-config monitoring: external ping with alerts, resource monitoring (avg latency, CPU, memory)
 * Zero-config middleware: postbacks, request logging, authentication, compression, https, instance affinity
 * No more workers: pushqueue/cron helps treating internal triggers like external HTTP requests
 * Automatic CDN hosting of static content
 * Automatic geo-redundency


 >> Note: some of the features are still under development, but you get the gist of it...

# Communicato

__Welcome, welcome, welcome!__ Getting started with anode should be a piece of cake.
If it isn't, please let us know by [opening issues](https://github.com/anodejs/repo/issues/new), 
[updating this file](https://github.com/anodejs/repo/edit/master/README.md) as you see fit or 
mailing the [anodejsdev@microsoft.com](mailto:anodejsdev@microsoft.com) list.
Also, please [subscribe](http://idwebelements/GroupManagement.aspx?Group=anodejsdev&Operation=join) to
the _anodejsdev_ distribution list. We are sending important announcements there.

Notice - this page doesn't look good in IE. Consider other browsers when you work with GitHub.

# Getting started

Make sure you have:

 1. Github [account](https://github.com/signup/free)
 2. [Set up git on your box](http://help.github.com/win-set-up-git). 
    Follow _all_ the instructions. Make sure to set up a private key with github as well (tip: avoid a password, 
    you will get crazy from all the pulls and pushes).
 3. Install [node.js](http://nodejs.org/#download).
 4. Alias `npm` for git bash:
    * Create ```~/.bash_profile``` file if you don't already have one (from the git bash shell)
    * Add the line: ```alias npm='node /c/Program\ Files\ \(x86\)/nodejs/node_modules/npm/bin/npm-cli.js'```
 5. Add ```C:\Program Files (x86)\nodejs``` to your system PATH (first one please).
 6. Watch [this lecture](http://www.youtube.com/watch?v=RO1Wnu-xKoY) about javascript.
 7. Go over the [javascript guide](https://developer.mozilla.org/en-US/docs/JavaScript/Guide).
 8. Watch [this lecture](http://www.youtube.com/watch?v=jo_B4LTHi3I) about nodejs. 
 8. Set up the editor/IDE of your choise with tabs = 2 spaces.

# Your First Node.js Applicaiton
This is a short tutorial (should take about 30 minutes) to get you started on the essentials of node and github. 

Fire up "git bash" (from the Start menu...).

## 1. Clone training-repository.
```bash
mkdir /c/projects
mkdir /c/projects/nodejs
mkdir /c/projects/nodejs/training
cd /c/projects/nodejs/training
git clone git@github.com:mousaz/training-repo.git .
```
## 2. Create a new git branch to include your changes within it. Please let the name of branch reflect your ownership for it along with its content.
For example, in this case it can be named 'lastname-firstapp'
```bash
git checkout -b <your_branch>
```

## 3. Create a directory for your applications in the format 'firstname-lastname' (e.g jonny-depp).
Please put all the apps you create under this subdirectory called by your firstname-lastname. This is important to keep things clean and not to 
interfer with others work. Also, create a directory of the application (e.g firstapp) and navigate to it.

```bash
mkdir firstname-lastname
mkdir firstname-lastname/firstapp
cd firstname-lastname/firstapp
```

## 4. Create __'index.js'__ which is the 'main' of your node app:
```javascript
var http = require('http');
http.createServer(function(req, res) {
   console.log('new request from ' + req.url);
   console.warn('this is a warning');
   console.error('this is an error');
   res.end('This is my first application');
}).listen(process.env.PORT || 5000);
console.log('info: myapp started at', new Date());
```

## 5. Test locally (assuming nodejs is in your PATH):
```bash
node index.js
```
Browse to http://localhost:5000 and see the result.

Press CTRL+C to kill it.

## 6. Push it to the cloud:
```bash
git add index.js                       # stage index.js for commit
git commit -m 'my first node app'      # commit to local repository
git push origin <your_branch_name>     # push master branch to origin (github)
```

## 7. Creating a test app for your app

In this turotial we will use [nodeunit](https://github.com/caolan/nodeunit) to create our test app.

 * Create a test app for your ```firstapp``` app:

```bash
mkdir firstname-lastname/test
cd firstname-lastname/test
```

 * Create ```tests.js``` for the tests:

```javascript
var request = require('request');
exports.mytest = function(test) {
    var target = 'localhost:5000'; // to run locally
    request('http://' + target, function(err, res, body) {
        test.equals(res.statusCode, 200, "expecting 200 OK");
        test.done();
    });
};
```

Run your tests locally using `nodeunit`:

 * Install `nodeunit` in the global scope using npm: `npm install -g nodeunit` (this adds `nodeunit` to the PATH).
 * Open a git bash window, navigate to ```firstname-lastname``` and start your app:

```bash
$ cd firstname-lastname/firstapp
$ node index.js
info: myapp started at Sun, 15 Jan 2012 11:18:43 GMT
```

 * Open another git bash window, navigate to ```firstname-lastname/firstapp/test``` and run the tests using `nodeunit`:
  
```bash
$ cd anoder/firstapp/test
$ nodeunit tests.js

tests.js
new request from /
this is a warning
this is an error
✔ mytest
```

 * Now you are ready to push the code to origin:
 
```bash
git add test/tests.js  # assuming you are under firstapp directory
git commit -m 'adding test app for firstapp'
git push <your-branch>
```

# Learning git and node.js

 * http://nodejs.org - home page of node.js
 * http://zguide.zeromq.org/js:_start - node.js samples
 * http://nodejs.org/api/ - reference to node.js apis
 * http://search.npmjs.org - node package manager registry
 * http://help.github.com/git-cheat-sheets - git cheatsheets
 * http://git-scm.com/book - Pro Git Book
 * http://www-cs-students.stanford.edu/~blynn/gitmagic/index.html - More on Git.