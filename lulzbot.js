//"Server," which runs the IRC side of things

var sys = require('sys');

var DNode = require('dnode');

var IRC = require('./lib/node-irc/lib/irc');
var spawn = require('child_process').spawn;
var fs = require('fs');

var ircserver = 'irc.freenode.net';
var nick = 'lulzbot-X';
var options = { userName: 'lulzbot',
                realName: 'LulzBot the node.js IRC bot!',
                debug: true,
                channels: ['#stackvm'],
                retryCount: 5 };

var irc = new IRC.Client(ircserver, nick, options);

//Some logics that run the server as a separate process
var server = function () {
    var srv = spawn("node", ["services.js"]);
    srv.stdout.on("data", function (data) {
        console.log("Server data: "+data);
    });
    srv.stderr.on("data", function (data) {
        console.log("Server error: "+data);
    });
    srv.on('exit', function (code) {
        console.log("Server exited with status "+code);
        console.log("Restarting.");
        server();
    });
    fs.watchFile("services.js", function () {
        console.log("Server code changed!");
        console.log("Restarting it.");
        srv.kill();
        server();
    });
}

//Using dnode to call services
DNode(function(services) {
    this.triggers = function () {
        irc.on('message', function (from, to, message) {
            services.triggers(message,function(reply) {
                irc.say(to, reply);
            });
        });
    };

    this.subscriptions = function () {
        //args: to, reply
        services.subscriptions(irc.say);
    };

}).listen(12321);

//Runs the server
server();
