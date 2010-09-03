//TODO: Reload command/REPL action

var sys = require('sys');

var gitwatch = require('./gitwatch').gitwatch;
var IRC = require('./lib/node-irc/lib/irc');
var getWeather = require('./weather').getWeather;
var ship = require('./onscreen').ship;

var server = 'irc.freenode.net';
var nick = 'lulzbot-X';
var options = { userName: 'lulzbot',
                realName: 'LulzBot the node.js IRC bot!',
                debug: true,
                channels: ['#stackvm'],
                retryCount: 5 };

var client = new IRC.Client(server, nick, options);

//message-triggers
client.on('message', function (from, to, message) {
    //weather
    if (matched = message.match(/^!w(x|eather) (.+)$/)) {
        try {
            getWeather(matched,function (x) {client.say(to,x)});
        } catch (e) {
            console.log("There was an error in getWeather: "+sys.inspect(e));
            client.say(to,"There was a promblem. Try again later. Soz!");
        }
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
var gw = function () {
    self = this;
    try {
        gitwatch(function(dest,msg){
            console.log(sys.inspect(dest));
            console.log(sys.inspect(msg));
            client.say(dest,msg);
        });
    } catch (e) {
        console.log("uncaught error in gitwatch: "+sys.inspect(e));
        self();
    }
}
