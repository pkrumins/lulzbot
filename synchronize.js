//An experiment in auto-watching github

var getBranch = require('./branch');

//Synchronize repo with github...
setInterval(function () {
    getBranch(function (branch) {
        spawn('git', ['pull', 'origin', branch]);
    });
}, 120000); //...every 2 minutes or so
