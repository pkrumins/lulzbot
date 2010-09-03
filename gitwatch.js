var fs = require('fs');
var gh = new (require('./lib/node-github/lib/github').GitHubApi)(true);
var sys = require('sys');

exports.gitwatch = function (callback) { 
    //What Happens
    var configfile = './gitwatch.json';
    var watchlist = {};
    var listlock = false;
    gwUpdate();
    fs.watchFile(configfile, gwUpdate);
    setInterval(function () {checkCommits(callback);}, 30000);

    function tripleLoop(cb) {
        listlock = true;
        for (u in watchlist) { 
            for (r in watchlist[u].repos) { 
                for (b in watchlist[u].repos[r].branches) {
                    cb(u,r,b);
                }
            }
        }
        listlock = false;
    }

    //Call this to update the value of gitwatch
    function gwUpdate () {
        var self = this;
        console.log('Loading '+configfile+"...");
        fs.readFile(configfile, 'utf-8', function (err,stream) {
            if (err) {
                console.log("Reading "+configfile+"broke! This probably means the json is mal-formed.");
            } else if (listlock) {
                var wait = 5000;
                console.log("List is locked! Giving it a try again in " + wait/1000 + " seconds.");
                setTimeout(self, wait);
            } else {
                //locking the list
                listlock = true;
                console.log("Parsing json...");
                watchlist = JSON.parse(stream);
                console.log("Initializing watchlist...");
                tripleLoop(function (u,r,b) {
                    gh.getCommitApi().getBranchCommits(watchlist[u].user,
                                                       watchlist[u].repos[r].label,
                                                       watchlist[u].repos[r].branches[b].label,
                                                       function (err,commits) {
                        if (err) { 
                            console.log("Watchlist initializing "
                                       +" on user: "+watchlist[u].user
                                       +", repo: "+watchlist[u].repos[r].label
                                       +", branch: "+watchlist[u].repos[r].branches[b].label
                                       +", messed up like so: "+sys.inspect(err)
                                       +"; This may be due to a problem in the source json." );
                        } else {
                            watchlist[u].repos[r].branches[b].lastCommit = commits[0].id;
                        }
                    }); //closes api callback
                }); //closes triple loop
            } //closes listlock check
        }); //closes readFile
    }

    //Checks for new commits in each branch
    function checkCommits(callback) {

        var maxList = 5;
        var msg = "";
        var greetz = ["Whoa Nelly!",
                      "Zounds!",
                      "Egads!",
                      "Oh snap!",
                      "Aack!"];

        if (listlock) {
            var wait = 5000;
            console.log("List is locked! Giving it a try again in " + wait/1000 + " seconds.");
            setTimeout(self, wait);
        } else {
            tripleLoop(function (u,r,b) {
                //Checks for the existence of lastCommit
                if (watchlist[u].repos[r].branches[b].lastCommit) {
                    gh.getCommitApi().getBranchCommits(watchlist[u].user,
                                                       watchlist[u].repos[r].label,
                                                       watchlist[u].repos[r].branches[b].label,
                                                       function (err,commits) {

                        if (err) {
                            console.log("Gitwatching checking broke on user: " + watchlist[u].user
                                      + ", repo: " + watchlist[u].repos[r].label
                                      + ", branch: " + watchlist[u].repos[r].branches[b].label 
                                      + ", with the following error: " + sys.inspect(err)
                                );
                        } else {
                            //If there are new commits...
                            if (commits[0].id !== watchlist[u].repos[r].branches[b].lastCommit) {
                                //build up list of new commits
                                var commitsList=[];
                                i=0;
                                while (commits[i].id !== watchlist[u].repos[r].branches[b].lastCommit) {
                                    commitsList = ["    * "+commits[i].author.name+": "+commits[i].message].concat(commitsList);
                                    i++;
                                }
                                if (commitsList.length > maxList) {
                                    commitsList = commitsList.slice(0,Math.floor(maxList/2))
                                                            .concat("      ...")
                                                            .concat(commitsList.slice(commitsList.length-Math.floor(maxList/2),commitsList.length));
                                }

                                //Launch torpedoes
                                watchlist[u].repos[r].channels.forEach(
                                    function (c) {
                                        callback(c, greetz[Math.floor(Math.random()*greetz.length)]
                                                  + " New commits to "+watchlist[u].user+"/"
                                                  + watchlist[u].repos[r].label
                                                  + " ("+watchlist[u].repos[r].branches[b].label+")!");
                                        for (n in commitsList) {
                                            callback(c,commitsList[n]);
                                        }
                                        callback(c, "githubs: http://github.com/"
                                                  + watchlist[u].user+"/"
                                                  + watchlist[u].repos[r].label+"/tree/"
                                                  + watchlist[u].repos[r].branches[b].label );
                                    }
                                );
                                        
                                //We now have a new lastCommit:
                                watchlist[u].repos[r].branches[b].lastCommit = commits[0].id;

                                //crappy hack thrown in to make sure I don't time out Github
                                var date = new Date();
                                var curDate = null;
                                do {curDate = new Date();} while (curDate-date < 1000);
                            } //closes "if new commits"
                        } //closes if/else
                    }); //closes API call
                } //closes lastCommit check
            });//closes triple loop
        } //closes "unlocked"
    }
}

