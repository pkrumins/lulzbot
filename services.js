//"Server," which gives access to all the modules via dnode

var sys = require('sys');
var DNode = require('dnode');
var spawn = require('child_process').spawn

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
            var git = spawn("git", ["branch"]);
            git.stdout.on('data', function (branches) {
                    var sed = spawn("sed", ["-n", "-e", "s/^\* \(.*\)/\1/p"]);
                    sed.stdin.write(branches);
                    sed.stdout.on('data', function (currentBranch) {
                        cb("http://github.com/jesusabdullah/lulzbot/tree/"+sys.inspect(currentBranch));
                    });
                });
        }
    },

    subscribe: function (cb) {
        gitwatch(cb);
    }

}).listen(12321);
