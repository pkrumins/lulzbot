//TODO: Install libs s.t. abs. paths are unnecessary
//TODO: Test (require().s)() idea
//TODO: Config file
//TODO: Reload command/REPL action
//TODO: Wrap bot up in something like a separate-able library a la Jerk?
//TODO: Figure out why bot eventually "times out" and fix
//TODO: Change trackBranch s.t. a single call with a heirarchical structure
//passed in as input
var sys = require('sys');
var gitwatch = require('./gitwatch').gitwatch;
var Jerk = require('./lib/Jerk/lib/jerk');
var EE = require('events').EventEmitter;
var getWeather = require('./weather').getWeather;

var options = { server: 'irc.freenode.net',
                nick: 'lulzbot',
                channels: ['#stackvm']};

jerk = Jerk(function(j) {
    //weather action
    j.watch_for(/^!w(x|eather) (.+)$/, function (message) {
        getWeather(message.match_data[2],message.say);
    });
    //source
    j.watch_for("!source", function (message) {
        message.say("http://github.com/jesusabdullah/lulzbot/blob/master/lulzbot.js");
    });
}).connect(options);

gitwatch(jerk.say);
//gitwatch(function(x,y) {sys.puts(y)});

