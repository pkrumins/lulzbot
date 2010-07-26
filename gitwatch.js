//testing out yaml stuff
var fs = require('fs');
var gh = new (require('./lib/github').GitHubApi)(true);
var yaml = require('yaml');
var sys = require('sys');

//var git = require('./yamltest').gitwatch; var sys = require('sys'); git(function(x,y) {sys.puts(x); sys.puts(y);});
exports.gitwatch = function (callback) { 
    var configfile = './gitwatch.json';
    var watchlist = {};
    gwUpdate();
    fs.watchFile(configfile, gwUpdate);
    setInterval(function () {checkCommits(callback);}, 15000);

    //Call this to update the value of gitwatch
    function gwUpdate () {
        fs.readFile(configfile, 'utf-8', function (err,stream) {
            if (err) throw err;
            watchlist = JSON.parse(stream);
            });
        for (u in watchlist) {
            var user = watchlist[u].user;
            for (r in watchlist[u].repos) {
                var repo = watchlist[u].repos[r].name;
                for (b in watchlist[u].repos[r].branches) {
                    branch = watchlist[u].repos[r].branches[b];
                    //fuxxing up the read-in json
                    //for easier adding of last commit
                    watchlist[u].repos[r].branches[b] = {name: branch, lastCommit: ''};
                    gh.getCommitApi().getBranchCommits(user,repo,branch, function (err,commits) {
                        watchlist[u].repos[r].branches[b].lastCommit = commits[0].id;
                    });
                }
            }
        }
    }


//Checks for new commits in each branch
    function checkCommits(callback) {
        var greetz = ["Whoa Nelly!",
                      "Zounds!",
                      "Egads!",
                      "Oh snap!",
                      "Aack!"];

        for (u in watchlist) {
            var user = watchlist[u].user;
            for (r in watchlist[u].repos) {
                var repo = watchlist[u].repos[r].name;
                for (b in watchlist[u].repos[r].branches) {
                    branch = watchlist[u].repos[r].branches[b].name;
                    channels = watchlist[u].repos[r].channels;
                    //grab commits
                    gh.getCommitApi().getBranchCommits(user,repo,branch, function (err,commits) {
                        var lastCommit = watchlist[u].repos[r].branches[b].lastCommit;
                        //logic that prints out commits
                        var maxcommitlist = 5;
                        var i = 0;
                        var commitlist = [];
                        while ( i < commits.length && commits[i].id !== lastCommit ) {
                            if (i==0) {
                                for (c in channels) {
                                    callback(channels[c], greetz[Math.floor(Math.random()*greetz.length)]+" New commits to "+usr+"/"+repo+" ("+branch+")!"); 
                                }
                            }
                            commitlist=["    * "+commits[i].author.name+": "+commits[i].message].concat(commitlist);
                            i++; 
                        }
                        //check for population of commitlist (DEBUG)
                        for (i in commitlist) { sys.puts(commitlist[i]);}
                        if (commitlist.length > maxcommitlist) {
                            var newcommitlist = commitlist.slice(0,Math.floor(maxcommitlist/2));
                            newcommitlist.push("...");
                            newcommitlist.push(commitlist.slice(commitlist.length-Math.floor(maxcommitlist/2),commitlist.length));
                            newcommitlist.push("(And more! This list was truncated for brevity's sake.)");
                            commitlist = newcommitlist;
                        }
                        for (i in commitlist) {
                            for (ind in channels) {
                                sys.puts(commitlist[i]);
                                callback(channels[c], commitlist[i]);
                            }
                        }
                        if (commits[0].id !== watchlist[usr][repo][branch].lastCommit) { 
                            for (c in channels) {
                                callback(channels[c], "githubs: http://github.com/"+username+"/"+repo+"/tree/"+branch);
                            }
                        }
                        //updates lastCommit here
                        watchlist[u].repos[r].branches[b].lastCommit = commits[0].id
                    });
                }
            }
        }
    }
}
