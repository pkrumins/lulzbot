var fs = require('fs');
var gh = new (require('./lib/node-github/lib/github').GitHubApi)(true);
var sys = require('sys');

exports.gitwatch = function (callback) { 
    var configfile = './gitwatch.json';
    var watchlist = {};
    gwUpdate();
    fs.watchFile(configfile, gwUpdate);
    setInterval(function () {checkCommits(callback);}, 30000);

    //TODO: Add semaphores to every level of the watchlist

    //Call this to update the value of gitwatch
    function gwUpdate () {
        //sys.puts('updating!');
        fs.readFile(configfile, 'utf-8', function (err,stream) {
            if (err) {
                console.log("Reading the gitwatch config file broke.");
                //throw err;
            } else {
            watchlist = JSON.parse(stream);
            for (u in watchlist) {
                for (r in watchlist[u].repos) {
                    for (b in watchlist[u].repos[r].branches) {
                        watchlist[u].repos[r].branches[b] = {label: watchlist[u].repos[r].branches[b], lastCommit: undefined, lock: false};
                        (function (u,r,b) {
                            //semaphore axxion--tries to update every five seconds until successful, or some such
                            while (watchlist[u].repos[r].branches[b].lock) {
                                //stolen from http://www.sean.co.uk/a/webdesign/javascriptdelay.shtm
                                //Feels dirty
                                var date = new Date();
                                var curDate = null;
                                do {curDate = new Date();}while(curDate-date < 5000);
                            }
                            watchlist[u].repos[r].branches[b].lock = true;
                            gh.getCommitApi().getBranchCommits(watchlist[u].user,watchlist[u].repos[r].label,watchlist[u].repos[r].branches[b].label, function (err,commits) {
                                if (err) { 
                                    console.log("Shit-balls, there was a gitwatch init error: "+sys.inspect(err)
                                               +" on user: "+watchlist[u].user
                                               +", repo: "+watchlist[u].repos[r].label
                                               +" branch: "+watchlist[u].repos[r].branches[b].label );
				} else {
	                                watchlist[u].repos[r].branches[b].lastCommit = commits[0].id;
        	                        watchlist[u].repos[r].branches[b].lock = false;
				}
                            });
                            
                        }).call(this, u,r,b);
                    }
                }
            }
            }
        });
    }


    //Checks for new commits in each branch
    function checkCommits(callback) {
        for (u in watchlist) {
            for (r in watchlist[u].repos) {
                for (b in watchlist[u].repos[r].branches) {
                    branch = watchlist[u].repos[r].branches[b].label;
                    channels = watchlist[u].repos[r].channels;
                    //If lastCommit hasn't been stored, then this won't work!
                    if (watchlist[u].repos[r].branches[b].lastCommit) {
                        //use these particular indices, because they'll change on you if not grabbed, saved, scoped
                        (function (u,r,b) {
                            //semaphore axxion
                            if(!watchlist[u].repos[r].branches[b].lock) {
                                gh.getCommitApi().getBranchCommits(watchlist[u].user,watchlist[u].repos[r].label,watchlist[u].repos[r].branches[b].label, function (err,commits) {
                                    var maxList = 5;
                                    var msg = "";
                                    var greetz = ["Whoa Nelly!",
                                                  "Zounds!",
                                                  "Egads!",
                                                  "Oh snap!",
                                                  "Aack!"];
                                    //crappy hack thrown in to make sure I don't time out Github
                                    var date = new Date();
                                    var curDate = null;
                                    do {curDate = new Date();}while(curDate-date < 1000);

                                    if (err) {
                                        console.log("Bollocks! Gitwatching broke: " + sys.inspect(err)
                                                   +" on user: "+watchlist[u].user
                                                   +", repo: "+watchlist[u].repos[r].label
                                                   +" branch: "+watchlist[u].repos[r].branches[b].label );
                                    } else {
                                    //If there are new commits...
                                    if (commits[0].id !== watchlist[u].repos[r].branches[b].lastCommit) {
                                        //build up list of new commits
                                        var commitsList=[];
                                        i=0;
                                        //The most sane thing here would be to make sure commits[i] is defined.
                                        //I think it might be breaking this though.
                                        while (commits[i].id !== watchlist[u].repos[r].branches[b].lastCommit) {
                                            //sys.puts('im in ur commit-fetching loop');
                                            //sys.puts(i);
                                            //sys.puts(commitsList);
                                            commitsList = ["    * "+commits[i].author.name+": "+commits[i].message].concat(commitsList);
                                            i++;
                                            //sys.puts(commitsList);
                                        }
                                        //What if we have TOO MANY COMMITS?
                                        if (commitsList.length > maxList) {
                                            //sys.puts('im in ur truncation loop');
                                            commitsList = commitsList.slice(0,Math.floor(maxList/2))
                                                         .concat("      ...")
                                                         .concat(commitsList.slice(commitsList.length-Math.floor(maxList/2),commitsList.length));
                                        }

                                        //Launch torpedoes
                                        //TODO: Make a single callback instead of fifty callbacks
                                        watchlist[u].repos[r].channels.forEach(function (c) {callback(c,
                                            greetz[Math.floor(Math.random()*greetz.length)]+" New commits to "+watchlist[u].user+"/"+watchlist[u].repos[r].label+" ("+watchlist[u].repos[r].branches[b].label+")!"
                                        );});
                                        
                                        watchlist[u].repos[r].channels.forEach(function (c) {
                                            for (n in commitsList) {
                                                callback(c,commitsList[n]);
                                            }
                                        });

                                        watchlist[u].repos[r].channels.forEach(function (c) {callback(c,
                                            "githubs: http://github.com/"+watchlist[u].user+"/"+watchlist[u].repos[r].label+"/tree/"+watchlist[u].repos[r].branches[b].label
                                        );});

                                        //reset commits[0]
                                        watchlist[u].repos[r].branches[b].lock = true;
                                        watchlist[u].repos[r].branches[b].lastCommit = commits[0].id;
                                        watchlist[u].repos[r].branches[b].lock = false;
                                    }
                                    }
                                });
                            }
                        }).call(this,u,r,b); //using these particular indices (concurrency!)
                    }
                }
            }
        }
    }
}
