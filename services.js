#!/usr/bin/env node

//"Client," which gives access to all the modules via dnode

var sys = require('sys');
var DNode = require('dnode');
var getBranch = require('./branch');

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
            getBranch(function (branch) {
                cb("http://github.com/jesusabdullah/lulzbot/tree/"+branch+"/");
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
