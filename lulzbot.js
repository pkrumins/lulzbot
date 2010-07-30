//TODO: Install libs s.t. abs. paths are unnecessary
//TODO: Reload command/REPL action

var sys = require('sys');
var gitwatch = require('./gitwatch').gitwatch;
//var Jerk = require('./lib/Jerk/lib/jerk');
var IRC = require('irc');
var EE = require('events').EventEmitter;
var getWeather = require('./weather').getWeather;

var server = 'irc.freenode.net';
var nick = 'lulzbot';
var options = { userName: 'lulzbotX',
                realName: 'LulzBot the node.js IRC bot!',
                debug: true,
                channels: ['#stackvm'] };

var client = new IRC.Client(server, nick, options);

//message-triggers
client.on('message', function (from, to, message) {
    //weather
    if (matched = message.match(/^!w(x|eather) (.+)$/)) {
        getWeather(matched,function (x) {client.say(to,x)});
    }

    //source
    if (matched = message.match("!source")) {
        client.say(to, "http://github.com/jesusabdullah/lulzbot");
    }
});

//gitwatch trigger
gitwatch(function (chan, msg) {
    sys.puts(chan,msg);
    client.say(chan,msg);
});
