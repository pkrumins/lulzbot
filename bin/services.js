#!/usr/bin/env node

//"Client," which gives access to all the modules via dnode

var sys = require('sys');
var DNode = require('dnode');
var getBranch = require('../plugins/branch');

var gitwatch = require('../plugins/gitwatch').gitwatch;
var getWeather = require('../plugins/weather').getWeather;
var spaceship = require('../plugins/onscreen').ship;
var lns = require('../plugins/lns');

console.log("Starting dnode \"client\" on port 12321.");
DNode({
    triggers: function (msg, cb) {
        if (matched = msg.match(/^!w(x|eather) (.+)$/)) {
            console.log('wx match: '+sys.inspect(matched));
            console.log(matched.length);
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
    },

    subscriptions: function (cb) {
        gitwatch(cb);
    }

}).connect(12321, function (irc) {
    irc.triggers();
    irc.subscriptions();
});
