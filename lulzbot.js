//TODO: Install libs s.t. abs. paths are unnecessary
//TODO: Test (require().s)() idea
//TODO: Config file
//TODO: Reload command/REPL action
//TODO: Wrap bot up in something like a separate-able library a la Jerk?
//TODO: Figure out why bot eventually "times out" and fix
//TODO: Change trackBranch s.t. a single call with a heirarchical structure
//passed in as input
var sys = require('sys');
var trackBranch = require('./trackBranch').trackBranch;
var jerk = require('./lib/Jerk/lib/jerk');
var EE = require('events').EventEmitter;
var getWeather = require('./weather').getWeather;

var options = { server: 'irc.freenode.net',
                nick: 'lulzbot',
                channels: ['#stackvm']};

jerk(function(j) {
    //weather action
    j.watch_for(/^!w(x|eather) (.+)$/, function (message) {
        getWeather(message.match_data[2],message.say);
    });
    //source
    j.watch_for("!source", function (message) {
        message.say("http://github.com/jesusabdullah/lulzbot/blob/master/lulzbot.js");
    });
}).connect(options);

eventer = new EE();
//Outside listeners
//This is kind of a leftover "wart" due to how trackBranch works. 
//I plan to ditch this listener later.
eventer.addListener("git", function(x) { jerk.say('#stackvm', x) });

//tracked git branches
trackBranch("substack", "dnode", "master",
    function(shout) {eventer.emit("git", shout)} );
trackBranch("substack", "js-traverse", "master", 
    function(shout) {eventer.emit("git", shout)});
trackBranch("substack", "stackvm", "master", 
    function(shout) {eventer.emit("git", shout)});

trackBranch("pkrumins", "node-jsmin", "master",
    function(shout) {eventer.emit("git", shout)});
trackBranch("pkrumins", "stackvm", "master",
    function(shout) {eventer.emit("git", shout)});

trackBranch("jesusabdullah", "jesusabdullah.github.com", "master",
    function(shout) {eventer.emit("git", shout)});
trackBranch("jesusabdullah", "lulzbot", "master",
    function(shout) {eventer.emit("git", shout)});

