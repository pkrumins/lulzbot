var gh = new (require('./lib/github').GitHubApi)(true); //mebbs?

exports.trackBranch = function trackBranch(username, repo, branch, callback) {
    gh.getCommitApi().getBranchCommits(username, repo, branch, checker );

    function checker(err, commits) {
        var oldCommitId = commits[0].id; //Set to 1 for testing (should be 0)
        var greetz = ["Whoa Nelly!",
                      "Zounds!",
                      "Egads!",
                      "Oh snap!",
                      "Aack!"];
        setInterval(function() {
          gh.getCommitApi().getBranchCommits(username, repo, branch, 
          function(err, commits) {
            var i = 0;
            while ( i < commits.length && commits[i].id !== oldCommitId ) {
                if (i==0) {callback(greetz[Math.floor(Math.random(greetz.length))]+" New commits to "+username+"/"+repo+" ("+branch+")!");}
                callback("    * "+commits[i].author.name+": "+commits[i].message);
                i++; }
            if (commits[0].id !== oldCommitId) { 
                callback("githubs: http://github.com/"+username+"/"+repo+"/tree/"+branch);}
            oldCommitId = commits[0].id});
        }, 30000);
    }
}
