#!/usr/bin/env node

//"Client," which gives access to all the modules via dnode

var sys = require('sys');
var DNode = require('dnode');
var spawn = require('child_process').spawn;

var gitwatch = require('./gitwatch').gitwatch;
var getWeather = require('./weather').getWeather;
var spaceship = require('./onscreen').ship;

console.log("Starting dnode \"client\" on port 12321.");
DNode({
    triggers: function (msg, cb) {
        if (matched = msg.match(/^!w(x|eather) (.+)$/)) {
            getWeather(matched,cb);
        }
        if (matched = msg.match("!onscreen")) {
            spaceship.forEach(cb);
        }
        if (matched = msg.match("!source")) {
            var getbranch = spawn("./branch.sh");
            getbranch.stdout.on('data', function (data) {
                var branch = data.toString("utf-8");
                branch = branch.slice(0,branch.length-1);
                cb("http://github.com/jesusabdullah/lulzbot/tree/"+branch+"/");
            });
            getbranch.stderr.on('data', function (data) {
                console.log("There was a source-getting error: "+data.toString("utf-8"));
            });
        }
    },

    subscriptions: function (cb) {
        gitwatch(cb);
    }

}).connect(12321, function (irc) {
    irc.triggers();
    irc.subscriptions();
});
