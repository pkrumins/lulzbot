//"Server," which gives access to all the modules via dnode

var sys = require('sys');
var DNode = require('dnode');

var gitwatch = require('./gitwatch').gitwatch;
var getWeather = require('./weather').getWeather;
var spaceship = require('./onscreen').ship;


DNode({
    triggers: function (msg, cb) {
        if (matched = msg.match(/^!w(x|eather) (.+)$/)) {
            getWeather(matched,cb);
        }
        if (matched = msg.match("!onscreen")) {
            spaceship.forEach(cb);
        }
        if (matched = msg.match("!source")) {
            cb("http://github.com/jesusabdullah/lulzbot");
        }
    },

    subscribe: function (cb) {
        gitwatch(cb);
    }

}).listen(12321);
