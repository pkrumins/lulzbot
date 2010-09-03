//"Client," which runs the IRC side of things

var sys = require('sys');
var DNode = require('dnode');
var IRC = require('./lib/node-irc/lib/irc');

var server = 'irc.freenode.net';
var nick = 'lulzbot-X';
var options = { userName: 'lulzbot',
                realName: 'LulzBot the node.js IRC bot!',
                debug: false,
                channels: ['#stackvm'],
                retryCount: 5 };

var irc = new IRC.Client(server, nick, options);

DNode.connect(12321, function(services) {
    //message triggers
    irc.on('message', function (from, to, message) {
        services.triggers(message,function(reply) {
            irc.say(to, reply);
        });
    });

    //subscribed services
    services.subscribe(irc.say);
});

