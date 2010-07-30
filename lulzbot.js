//TODO: Reload command/REPL action

var sys = require('sys');
var gitwatch = require('./gitwatch').gitwatch;
var IRC = require('irc');
var getWeather = require('./weather').getWeather;
var ship = require('./onscreen').ship;

var server = 'irc.freenode.net';
var nick = 'lulzbot-X';
var options = { userName: 'lulzbot',
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

    if (matched = message.match("!onscreen")) {
        ship.forEach(function(x) {client.say(to, x);});
    }

});

//gitwatch trigger
gitwatch(function(dest,msg){
    console.log(sys.inspect(dest));
    console.log(sys.inspect(msg));
    client.say(dest,msg);
});
