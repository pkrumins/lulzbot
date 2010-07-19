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
var IRC = require('./lib/irc');
var EE = require('events').EventEmitter;
var getWeather = require('./weather').getWeather;

var options = { server: 'irc.freenode.net',
                nick: 'lulzbot',
                channels: ['#stackvm']};

var bot = new IRC(options);
bot.connect(function() {setTimeout(bot.join(options.channels), 15000)});

eventer = new EE();
//Outside listeners
eventer.addListener("git", function(x) { bot.privmsg('#stackvm', x) });
eventer.addListener("weather", function(x) { bot.privmsg('#stackvm', x) });
eventer.addListener("showsource", function() {bot.privmsg('#stackvm','http://github.com/jesusabdullah/lulzbot/blob/master/lulzbot.js'); });

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

//bot listener
bot.addListener('privmsg', function(msg) {
    //Jerk has this.
    //IRC-js chokes on parsing messages if there's a backtick in a nick
    var text = msg.params.slice(-1).toString();
    //weather action
    if (text.match("^!w(x|eather) (.+)") !== null) {
        sys.puts(wx[2])
        getWeather(wx[2],function(shout) {eventer.emit("weather", shout);});
    }
    //source action
    if (text.match("^!source") !== null) {eventer.emit("showsource");}
});
