#!/usr/bin/env node

//"Server," which runs the IRC side of things

var sys = require('sys');

var DNode = require('dnode');

var IRC = require('./lib/node-irc/lib/irc');
var spawn = require('child_process').spawn;
var fs = require('fs');

console.log("Starting irc relay...");

var ircserver = 'irc.freenode.net';
var nick = 'lulzbot-X';
var options = { userName: 'lulzbot',
                realName: 'LulzBot the node.js IRC bot!',
                debug: false,
                channels: ['#stackvm'],
                retryCount: 5 };

var irc = new IRC.Client(ircserver, nick, options);

function say (to, reply) {
    console.log("Msg to "+to+": "+reply);
    irc.say(to,reply);
}

//Using dnode to call services
DNode(function(services) {
    this.triggers = function () {
        irc.on('message', function (from, to, message) {
            services.triggers(message,function(reply) {
                say(to, reply);
            });
        });
    };

    this.subscriptions = function () {
        //args: to, reply
        services.subscriptions(say);
    };

}).listen(12321);
