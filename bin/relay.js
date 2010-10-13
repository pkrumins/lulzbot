#!/usr/bin/env node
var argv = require('optimist')
    .usage('Usage: $0 OPTIONS\n'
        + '    Required OPTIONS: --server --nick\n'
        + '    Other OPTIONS: --username --realname --channel')
    .demand([ 'server', 'nick' ])
    .argv;

var spawn = require('child_process').spawn;
var fs = require('fs');

var DNode = require('dnode');
var IRC = require('irc');

var irc = new IRC.Client(argv.server, argv.nick, {
    userName : argv.username || argv.nick,
    realName : argv.realname || 'LulzBot the node.js IRC bot!',
    debug: true,
    channels: Array.isArray(argv.channel) ? argv.channel : [argv.channel],
    retryCount: 5,
});

function say (to, reply) {
    console.log("Msg to "+to+": "+reply);
    irc.say(to,reply);
}

//Using dnode to call services
DNode({}).listen(12321, function (services) {
    irc.on('message', function (from, to, message) {
        var msg = { message : message, from : from, to : to };
        if (matched = message.match(/^!join (#.+)$/)) {
            console.log("Trying to join "+matched[1]);
            try {
                irc.join(matched[1]);
            } catch(e) {
                irc.say(to, "Error: "+e);
            }
        } else if (matched = message.match(/^!part (#.+)$/) ) {
            if (matched[1] == argv.channel) {
                console.log("Trying to part "+matched[1]);
                try {
                    irc.part(matched[1]);
                } catch(e) {
                    irc.say(to, "Error: "+e);
                }
            } else {
                irc.say(to, "Nuh uh, gurl, not THIS channel!");
            }
        }
        services.triggers(msg, function (reply) { say(to, reply) });
    });
    
    services.subscriptions(say);
});
