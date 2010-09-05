#!/usr/bin/env node

//An experiment in auto-watching github

var getBranch = require('./branch');
var spawn = require('child_process').spawn;

console.log('Beginning synchronization loop...');

//Synchronize repo with github...
setInterval(function () {
    console.log('synchronizing...');
    getBranch(function (branch) {
        spawn('git', ['pull', 'origin', branch]);
    });
    console.log('...done.');
}, 120000); //...every 2 minutes or so
