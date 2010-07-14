//TODO: Like, Actually Install these things so they don't depend on abs. paths?

var sys = require('sys')
var GitHubApi = require('./lib/github').GitHubApi
//May want to use Jerk later. :/
var IRC = require('./lib/irc')

var gh = new GitHubApi(true)
var options = { server: 'irc.freenode.net',
                nick: 'lulzbot',
                channels: ['#stackvm']}

var bot = new IRC(options)

bot.connect(function() {bot.join('#stackvm')})

//todo: Make something similar to Jerk but which utilizes event emitters
//instead of, umm, what it does now.

/*trackBranch("jesusabdullah", "anisotropy", "master",
    function(x) { bot.privmsg('#stackvm', x) } */
trackBranch("substack", "dnode", "master",
    function(x) { bot.privmsg('#stackvm', x) })
trackBranch("substack", "js-traverse", "master", 
    function(x) { bot.privmsg('#stackvm', x) })
trackBranch("substack", "stackvm", "master", 
    function(x) { bot.privmsg('#stackvm', x) })

trackBranch("pkrumins", "node-jsmin", "master",
    function(x) { bot.privmsg('#stackvm', x) })
trackBranch("pkrumins", "stackvm", "master",
    function(x) { bot.privmsg('#stackvm', x) })

trackBranch("jesusabdullah", "jesusabdullah.github.com", "master",
    function(x) { bot.privmsg('#stackvm', x) })

//TODO: Make this take a single data structure?
//TODO: Get to return a single "stream" for emitting
function trackBranch(username, repo, branch, callback) {
    gh.getCommitApi().getBranchCommits(username, repo, branch, checker )

    function checker(err, commits) {
        shout=""
        var oldCommitId = commits[0].id //Set to 1 for testing (should be 0)

        setInterval(function() {
          gh.getCommitApi().getBranchCommits(username, repo, branch, 
          function(err, commits) {
            var i = 0
            while ( i < commits.length && commits[i].id !== oldCommitId ) {
                if (i==0) {shout+="Whoa nelly! New commits to "+username+"/"+repo+" ("+branch+")!\n"}
                shout+="    * "+commits[i].author.name+": "+commits[i].message+"\n"
                i++ }
            if (commits[0].id !== oldCommitId) { 
                shout+="githubs: http://github.com/"+username+"/"+repo+"/tree/"+branch+"\n"}
            oldCommitId = commits[0].id})
            callback(shout)
        }, 15000)
    }
}
