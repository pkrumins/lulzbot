#!/usr/bin/env node

//"Client," which gives access to all the modules via dnode

var sys = require('sys');
var DNode = require('dnode');
var getBranch = require('../plugins/branch');
var argv = require('optimist')
    .demand([ 'user', 'pass' ])
    .argv;


var gitwatch = require('../plugins/gitwatch');
var getWeather = require('../plugins/weather').getWeather;
var spaceship = require('../plugins/onscreen').ship;
var lns = require('../plugins/lns');
var twitter = require('../plugins/twitter');

console.log("Starting dnode \"client\" on port 12321.");
DNode(function () {
    this.triggers = function (message, cb) {
        var msg = message.message;
        
        if (matched = msg.match(/^!w(x|eather) (.+)$/)) {
            getWeather(matched[matched.length-1],cb);
        }
        if (matched = msg.match("!onscreen")) {
            spaceship.forEach(cb);
        }
        if (matched = msg.match("!source")) {
            getBranch(function (branch) {
                cb("http://github.com/jesusabdullah/lulzbot/tree/"+branch+"/");
            });
        }
        if (matched = msg.match("!help")) {
            cb("http://github.com/jesusabdullah/lulzbot/blob/master/README.md");
            cb("Warning: May be outta date.");
        }
        if (matched = msg.match(/^!lns (.+)$/)) {
            console.log('lns match: '+matched[matched.length-1]);
            lns(matched[matched.length-1],cb);
        }
        if (matched = msg.match(/^!watch\s+(.+)/)) {
            gitwatch.watch(message.to, matched[1]);
        }
        if (matched = msg.match(/^!unwatch\s+(.+)/)) {
            gitwatch.unwatch(message.to, matched[1]);
        }
    };
    
    this.subscriptions = function (cb) {
        gitwatch.listen(cb);
        twitter(argv.user, argv.pass, cb);
    };
}).connect(12321);
