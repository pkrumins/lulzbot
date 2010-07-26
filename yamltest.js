//testing out yaml stuff
var fs = require('fs');
var gh = new (require('./lib/github').GitHubApi)(true);
var yaml = require('yaml');
var sys = require('sys');


//var git = require('./yamltest').gitwatch; var sys = require('sys'); git(function(x,y) {sys.puts(x); sys.puts(y);});
exports.gitwatch = function (callback) { 
    var yamlfile = './gitwatch.yaml';
    var watchlist;
    gwUpdate;
    fs.watchFile(yamlfile, gwUpdate);
    setInterval(checkLastCommits(watchlist, callback),
                30000);

    //Call this to update the value of gitwatch
    function gwUpdate () {
        sys.puts('Updating watchlist...');
        getyaml(watchlist, 'utf-8', function (data) {gitwatch = data;});
        checkLastCommits(watchlist);
    }

    //Grabs the contents of a yaml file
    //A good value for "encoding" is "utf-8".
    function getyaml (filename, encoding, callback) {
        fs.readFile(filename, encoding, function (err,data) {
            if (err) throw err;
            callback(yaml.eval(data));
        });
    }

    //Checks for last commits in given branch
    function checkLastCommits(watchlist) {
        for (usr in watchlist) {
            for (repo in usr) {
                for (branch in repo) {
                //gitwatch[usr][repo][branch] --> channels
                //                            |-> lastCommit
                gh.getCommitApi().getBranchCommits(usr,repo,branch, function (err,commits) {
                    gitwatch[usr][repo][branch].lastCommit=commits[0].id;
                    });
                }
            }
        }
    }

    //Checks for last commits in given branch
    function checkLastCommits(watchlist, callback) {
        sys.puts('checking for new commits...');

        var greetz = ["Whoa Nelly!",
                      "Zounds!",
                      "Egads!",
                      "Oh snap!",
                      "Aack!"];

        for (usr in watchlist) {
            for (repo in watchlist[usr]) {
                for (branch in watchlist[usr][repo]) {
                channels = watchlist[usr][repo][branch].channels
                //The callback part might just work
                gh.getCommitApi().getBranchCommits(usr,repo,branch, function (err,commits) {
                    //logic that prints out commits
                    var maxcommitlist = 5;
                    var i = 1;
                    var commitlist = [];
                    while ( i < commits.length && commits[i].id !== watchlist[usr][repo][branch].lastCommit ) {
                        if (i==0) {
                            for (ind in channels) {
                                sys.puts(greetz[Math.floor(Math.random()*greetz.length)]+" New commits to "+username+"/"+repo+" ("+branch+")!");
                                callback(channels[ind], greetz[Math.floor(Math.random()*greetz.length)]+" New commits to "+username+"/"+repo+" ("+branch+")!"); 
                            }
                        }
                        commitlist=["    * "+commits[i].author.name+": "+commits[i].message].concat(commitlist);
                        i++; 
                    }
                    if (commitlist.length > maxcommitlist) {
                        commitlist.push(commitlist.slice(0,Math.floor(maxcommitlist/2)));
                        commitlist.push("...");
                        commitlist.push(commitlist.slice(commitlist.length-Math.floor(maxcommitlist/2),commitlist.length));
                        commitlist.push("(And more! This list was truncated for brevity's sake.)");
                    }
                    for (i in commitlist) {
                        for (ind in channels) {
                            callback(channels[ind], commitlist[i]);
                        }
                    }
                    if (commits[0].id !== lastCommit) { 
                        for (ind in channels) {
                            callback(channels[ind], "githubs: http://github.com/"+username+"/"+repo+"/tree/"+branch);
                        }
                    }
                    //updates oldCommit here
                    watchlist[usr][repo][branch].lastCommit = commits[0].id
                    });
                }
            }
        }
    sys.puts('done!');
    }
}