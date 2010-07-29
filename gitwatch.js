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
    setInterval(function () {checkCommits(callback);}, 30000);

    //Call this to update the value of gitwatch
    function gwUpdate () {
        //sys.puts('updating!');
        fs.readFile(configfile, 'utf-8', function (err,stream) {
            if (err) {throw err;}
            watchlist = JSON.parse(stream);
            for (u in watchlist) {
                for (r in watchlist[u].repos) {
                    for (b in watchlist[u].repos[r].branches) {
                        watchlist[u].repos[r].branches[b] = {label: watchlist[u].repos[r].branches[b], lastCommit: undefined};
                        (function (u,r,b) {
                            gh.getCommitApi().getBranchCommits(watchlist[u].user,watchlist[u].repos[r].label,watchlist[u].repos[r].branches[b].label, function (err,commits) {
                                if (err) { throw err; }
                                watchlist[u].repos[r].branches[b].lastCommit = commits[0].id;
                            });
                        }).call(this, u,r,b);
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
                            gh.getCommitApi().getBranchCommits(watchlist[u].user,watchlist[u].repos[r].label,watchlist[u].repos[r].branches[b].label, function (err,commits) {
                                var maxList = 5;
                                var msg = "";
                                var greetz = ["Whoa Nelly!",
                                              "Zounds!",
                                              "Egads!",
                                              "Oh snap!",
                                              "Aack!"];

                                if (err) {throw err;}
                                //If there are new commits...
                                if (commits[0].id !== watchlist[u].repos[r].branches[b].lastCommit) {
                                    //build up list of new commits
                                    var commitsList=[];
                                    i=0;
                                    //The most sane thing here would be to make sure commits[i] is defined.
                                    //I think it might be breaking this though.
                                    while (commits[i].id !== watchlist[u].repos[r].branches[b].lastCommit) {
                                        sys.puts('im in ur commit-fetching loop');
                                        commitsList = ["    * "+commits[i].author.name+": "+commits[i].message].concat(commitsList);
                                        i++;
                                        sys.puts(commitsList.length);
                                    }
                                    //What if we have TOO MANY COMMITS?
                                    if (commitsList.length > maxList) {
                                        sys.puts('im in ur truncation loop');
                                        commitsList = commitsList.slice(0,Math.floor(maxList/2))
                                                     .concat("      ...")
                                                     .concat(commitsList.slice(commitsList.length-Math.floor(maxList/2),commitsList.length));
                                    }
                                    //Assemble message
                                    var commitsStr = "";
                                    sys.puts(commitsList.length);
                                    sys.puts(commitsList.length-1);
                                    for (num in commitsList) {
                                        sys.puts(num);
                                        var commitsStr='\n'+commitsList[num]+commitsStr;
                                        if (num === commitsList.length-1) {
                                            msg=greetz[Math.floor(Math.random()*greetz.length)]+" New commits to "+watchlist[u].user+"/"+watchlist[u].repos[r].label+" ("+watchlist[u].repos[r].branches[b].label+")!\n"
                                                +commitsStr
                                                +"\ngithubs: http://github.com/"+watchlist[u].user+"/"+watchlist[u].repos[r].label+"/tree/"+watchlist[u].repos[r].branches[b].label+'\n';

                                        }
                                    }

                                    //Launch torpedos
                                    watchlist[u].repos[r].channels.forEach(function (c) {callback(c,msg);});
                                    //reset commits[0]
                                    watchlist[u].repos[r].branches[b].lastCommit = commits[0].id;
                                }
                            });
                        }).call(this,u,r,b); //using these particular indices (concurrency!)
                    }
                }
            }
        }
    }
}
