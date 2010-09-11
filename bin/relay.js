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
    debug: false,
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
        services.triggers(msg, function (reply) { say(to, reply) });
    });
    
    services.subscriptions(say);
});
