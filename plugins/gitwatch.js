var fs = require('fs');
var github = new (require('github').GitHubApi)(true).getCommitApi();
var sys = require('sys');
var Hash = require('traverse/hash');

var nStore = require('nStore');
module.exports = new Branches(nStore(__dirname + '/gitwatch/gitwatch.db'));

function Branches (db) {
    this.watch = function (channel, repo, cb) {
        var where = Hash.zip(['user','repo','branch'], repo.match(/([\w\-_]+)/g));
        if (!where.branch) where.branch = 'master';

        console.log("Watching "+where.user+'/'+where.repo+' ('+where.branch+')');

        var key = Hash(where).values.join('/');
        
        db.get(key, function (err, branch, meta) {
            var b = branch || { channels : [] };
            var updated = Hash.merge(b, {
                channels : b.channels.indexOf(channel) >= 0
                    ? b.channels
                    : b.channels.concat([ channel ])
                ,
                user : where.user,
                repo : where.repo,
                name : where.branch,
                key : key,
            });
            db.save(key, updated, cb);
        });
    };
    
    this.unwatch = function (channel, repo, cb) {
        var where = Hash.zip(['user','repo','branch'], repo.match(/([\w\-_]+)/g));
        if (!where.branch) where.branch = 'master';

        console.log("Unwatching "+where.user+'/'+where.repo+' ('+where.branch+')');

        var key = Hash(where).values.join('/');
        
        db.get(key, function (err, branch, meta) {
            if (err) { if (cb) cb(err); return }
            
            var i = branch.channels.indexOf(channel);
            if (i >= 0) branch.channels.splice(i,1);
            
            if (branch.channels.length) {
                db.save(key, branch, cb);
            }
            else {
                db.remove(key, cb);
            }
        });
    };
    
    this.getCommits = function (cb) {
        var stream = db.stream();
        stream.on('error', cb);
        stream.on('data', function (branch, cmeta) {
            github.getBranchCommits(
                branch.user, branch.repo, branch.name,
                function (err, commits) { cb(err, branch, commits) }
            );
        });
    };
    
    this.getUpdated = function (cb) {
        this.getCommits(function (err, branch, commits) {
            if (err) { cb(err, branch); return }
            
            if (branch.lastCommit != commits[0].id) {
                db.save(branch.key, Hash.merge(branch, {
                    lastCommit : commits[0].id
                }));
                
                if (branch.lastCommit) {
                    cb(null, branch, takeWhile(commits, function (commit) {
                        return commit.id != branch.lastCommit;
                    }));
                }
            }
        });
    };
    
    this.listen = function (cb) { 
        var poll = this.poll.bind(this);
        setInterval(function () { poll(cb) }, 30000);
    };
    
    this.poll = function (cb) {
        this.getUpdated(function (err, branch, commits) {
            if (err) { console.log('Error: %s', err); return }
            
            branch.channels.forEach(function (channel) {
                prepareMessage(branch, commits, function (msg) {
                    cb(channel, msg);
                });
            });
        });
    };
}

function prepareMessage (branch, commits, cb) {
    var greetz = ["Whoa Nelly!", "Zounds!", "Egads!", "Oh snap!", "Aack!"];
    var greet = greetz[ Math.floor(Math.random() * greetz.length) ];
    var repr = branch.user + '/' + branch.repo + ' (' + branch.name + ')';
    cb(greet + ' ' + commits.length + ' new commits to ' + repr + '!');
    
    commits.slice(0,4).forEach(function (commit) {
        cb('    * ' + commit.author.name + ': ' + commit.message);
    });
    
    var more = commits.length - 4;
    if (commits.length > 4) cb('    ... and ' + more + ' more!');
    cb('Githubs: http://github.com/'+branch.user+'/'+branch.repo
       +(branch.name === "master" ? "" : "/tree/"+branch.name));
}

function takeWhile(xs, f) {
    var acc = [];
    for (var i = 0; i < xs.length && f(xs[i]); i++);
    return xs.slice(0,i);
}
