//TODO: Install libs s.t. abs. paths are unnecessary
//TODO: Test (require().s)() idea
//TODO: Config file
//TODO: Reload command/REPL action
//TODO: Wrap bot up in something like a separate-able library a la Jerk?
//TODO: Figure out why bot eventually "times out" and fix
//TODO: Change trackBranch s.t. a single call with a heirarchical structure
//passed in as input
var sys = require('sys')
var GitHubApi = require('./lib/github').GitHubApi
var gh = new GitHubApi(true)
//var gh = new (require('./lib/github').GitHubApi)(true) //mebbs?
var IRC = require('./lib/irc')
var EE = require('events').EventEmitter


var options = { server: 'irc.freenode.net',
                nick: 'lulzbot',
                channels: ['#stackvm']}

var bot = new IRC(options)
//may "steal" some code from jerk for doing this more slickly
bot.connect(function() {bot.join(options.channels)})

eventer = new EE()
//Listeners
eventer.addListener("git", function(x) { bot.privmsg('#stackvm', x) })


//tracked git branches
trackBranch("substack", "dnode", "master",
    function(shout) {eventer.emit("git", shout)} )
trackBranch("substack", "js-traverse", "master", 
    function(shout) {eventer.emit("git", shout)})
trackBranch("substack", "stackvm", "master", 
    function(shout) {eventer.emit("git", shout)})

trackBranch("pkrumins", "node-jsmin", "master",
    function(shout) {eventer.emit("git", shout)})
trackBranch("pkrumins", "stackvm", "master",
    function(shout) {eventer.emit("git", shout)})

trackBranch("jesusabdullah", "jesusabdullah.github.com", "master",
    function(shout) {eventer.emit("git", shout)})
trackBranch("jesusabdullah", "lulzbot", "master",
    function(x) { bot.privmsg('#stackvm', x) }


function trackBranch(username, repo, branch, callback) {
    gh.getCommitApi().getBranchCommits(username, repo, branch, checker )

    function checker(err, commits) {
        var oldCommitId = commits[1].id //Set to 1 for testing (should be 0)

        setInterval(function() {
          gh.getCommitApi().getBranchCommits(username, repo, branch, 
          function(err, commits) {
            var i = 0
            while ( i < commits.length && commits[i].id !== oldCommitId ) {
                if (i==0) {callback("Whoa nelly! New commits to "+username+"/"+repo+" ("+branch+")!")}
                callback("    * "+commits[i].author.name+": "+commits[i].message)
                i++ }
            if (commits[0].id !== oldCommitId) { 
                callback("githubs: http://github.com/"+username+"/"+repo+"/tree/"+branch)}
            oldCommitId = commits[0].id})
        }, 30000)
    }
}
