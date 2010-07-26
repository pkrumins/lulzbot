//testing out yaml stuff
var fs = require('fs');
var gh = new (require('./lib/github').GitHubApi)(true);
var yaml = require('yaml');
var sys = require('sys');
var EE = require('events').EventEmitter;


//var git = require('./yamltest').gitwatch; var sys = require('sys'); git(function(x,y) {sys.puts(x); sys.puts(y);});
exports.gitwatch = function (callback) { 
    var yamlfile = './gitwatch.yaml';
    var watchlist = {};
    gwUpdate();
    //sys.puts(watchlist);
    fs.watchFile(yamlfile, gwUpdate);
    setInterval(function () {sys.puts("interval-ing"); 
                            checkCommits(callback);
    }, 15000);

    //Call this to update the value of gitwatch
    function gwUpdate () {
        getyaml(yamlfile, 'utf-8', function (x) {
            var data=x;
            for (usr in data) {
                for (repo in data[usr]) {
                    for (branch in data[usr][repo]) {
                    //watchlist[usr][repo][branch] --> channels
                    //                            |-> lastCommit
                    gh.getCommitApi().getBranchCommits(usr,repo,branch, function (err,commits) {
                        data[usr][repo][branch].lastCommit=commits[0].id;
                        });
                    }
                }
            }
        watchlist = data;
        });
    }

    //Grabs the contents of a yaml file
    //A good value for "encoding" is "utf-8".
    function getyaml (filename, encoding, callback) {
        fs.readFile(filename, encoding, function (err,data) {
            if (err) throw err;
            callback(yaml.eval(data));
        });
    }

    //Checks for new commits in each branch
    function checkCommits(callback) {
        sys.puts('checking for new commits...');

        var greetz = ["Whoa Nelly!",
                      "Zounds!",
                      "Egads!",
                      "Oh snap!",
                      "Aack!"];
        for (usr in watchlist) {
            for (repo in watchlist[usr]) {
                for (branch in watchlist[usr][repo]) {
                channels = watchlist[usr][repo][branch].channels;
                //get list of commits, do stuff with it
                gh.getCommitApi().getBranchCommits(usr,repo,branch, function (err,commits) {
                    //logic that prints out commits
                    var maxcommitlist = 5;
                    var i = 0;
                    var commitlist = [];
                    while ( i < commits.length && commits[i].id !== watchlist[usr][repo][branch].lastCommit ) {
                        if (i==0) {
                            for (ind in channels) {
                                callback(channels[ind], greetz[Math.floor(Math.random()*greetz.length)]+" New commits to "+usr+"/"+repo+" ("+branch+")!"); 
                            }
                        }
                        commitlist=["    * "+commits[i].author.name+": "+commits[i].message].concat(commitlist);
                        i++; 
                    }
                    if (commitlist.length > maxcommitlist) {
                        var newcommitlist = commitlist.slice(0,Math.floor(maxcommitlist/2));
                        newcommitlist.push("...");
                        newcommitlist.push(commitlist.slice(commitlist.length-Math.floor(maxcommitlist/2),commitlist.length));
                        newcommitlist.push("(And more! This list was truncated for brevity's sake.)");
                        commitlist = newcommitlist;
                    }
                    for (i in commitlist) {
                        for (ind in channels) {
                            callback(channels[ind], commitlist[i]);
                        }
                    }
                    if (commits[0].id !== watchlist[usr][repo][branch].lastCommit) { 
                        for (ind in channels) {
                            callback(channels[ind], "githubs: http://github.com/"+username+"/"+repo+"/tree/"+branch);
                        }
                    }
                    //updates lastCommit here
                    watchlist[usr][repo][branch].lastCommit = commits[0].id
                    });
                }
            }
        }
    sys.puts('done!');
    }
}
