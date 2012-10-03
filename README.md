# Training Repository
The purpose of this repository is to be a practical enviornment for training. 

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

# Your First Node.js Application
This is a short tutorial to get you started on the essentials of node and github. 

Fire up "git bash" (from the Start menu...).

## 1. Clone training-repository.
```bash
mkdir /c/projects
mkdir /c/projects/nodejs
mkdir /c/projects/nodejs/training
cd /c/projects/nodejs/training
git clone git@github.com:mousaz/training-repo.git .
```
## 2. Create a new git branch to include your changes within it. 
Please let the name of branch reflect your ownership for it along with its content. For example, in this case it can be named 'lastname-firstapp'
```bash
git checkout -b <your_branch>
```

## 3. Create a directory for your applications in the format 'firstname-lastname' (e.g jim-carrey). 
Please notice that throughtout this tutorial we'll call this directory 'your_dir', so when you start applying don't forget to replace it with your actual name. This is important to keep things clean and not to miss up others work.

```bash
mkdir your_dir
cd your_dir
```

## 4. Create 'node_modules' directory under 'your_dir'. 
This directory will hold the installation of the modules that you'll need during development.
```bash
mkdir node_modules
```

## 5. Create a subdirectory for your application under 'your_dir' (e.g firstapp) and navigate to it.
```bash
mkdir firstapp
cd firstapp
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
git push origin <your_branch>          # push your_branch to origin (github)
```

## 7. Creating a test for your application.

In this turotial we will use [nodeunit](https://github.com/caolan/nodeunit) to create our test app.

 * Create a test app for your ```firstapp``` app:

```bash
mkdir your_dir/test
cd your_dir/test
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
 * Open a git bash window, navigate to ```your_dir``` and start your app:

```bash
$ cd your_dir/firstapp
$ node index.js
info: myapp started at Sun, 15 Jan 2012 11:18:43 GMT
```

 * Open another git bash window, navigate to ```your_dir/firstapp/test``` and run the tests using `nodeunit`:
  
```bash
$ cd your_dir/firstapp/test
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
git push origin <your-branch>
```

# Learning git and node.js

 * http://nodejs.org - home page of node.js
 * http://zguide.zeromq.org/js:_start - node.js samples
 * http://nodejs.org/api/ - reference to node.js apis
 * http://search.npmjs.org - node package manager registry
 * http://help.github.com/git-cheat-sheets - git cheatsheets
 * http://git-scm.com/book - Pro Git Book
 * http://www-cs-students.stanford.edu/~blynn/gitmagic/index.html - More on Git.