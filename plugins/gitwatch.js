var fs = require('fs');
var github = new (require('github').GitHubApi)(true).getCommitApi();
var sys = require('sys');
var Hash = require('traverse/hash');
var Store = require('supermarket');

var dbfile = __dirname + '/gitwatch/gitwatch.db';
var db = Store({ filename : dbfile, json : true});

module.exports = new Branches;
function Branches () {
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
            db.set(key, updated);
        });
    };
    // test commit
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
                db.set(key, branch, cb);
            }
            else {
                db.remove(key, cb);
            }
        });
    };
    
    this.getCommits = function (cb) {
        db.forEach(function(err, branch, meta) {
            github.getBranchCommits(
                meta.user, meta.repo, meta.name,
                function (err, commits) { cb(err, branch, meta, commits) }
            );
        });
    };
    
    this.getUpdated = function (cb) {
        this.getCommits(function (err, branch, meta, commits) {
            if (err) { cb(err, branch); return }
            
            if (meta.lastCommit != commits[0].id) {
                db.set(branch, Hash.merge(meta, {
                    lastCommit : commits[0].id
                })); 
                
                if (meta.lastCommit) {
                    cb(null, branch, meta, takeWhile(commits, function (commit) {
                        return commit.id != meta.lastCommit;
                    }));
                }
            }
        });
    };

    //List all repos
    this.list = function (channel, cb) {
        db.filter(
            function (repo, meta) {
                return meta.channels.some(function (c) { return c === channel })
            },
            function (err, repo, meta) {
                if (err) {
                    console.log(err);
                } else {
                    cb(repo);
                }
            }
        );
    }
    
    this.listen = function (cb) { 
        var poll = this.poll.bind(this);
        setInterval(function () { poll(cb) }, 30000);
    };
    
    this.poll = function (cb) {
        this.getUpdated(function (err, branch, meta, commits) {
            if (err) { console.log(err); return }
            
            meta.channels.forEach(function (channel) {
                prepareMessage(branch, meta, commits, function (msg) {
                    cb(channel, msg);
                });
            });
        });
    };
}

function prepareMessage (branch, meta, commits, cb) {
    var greetz = ["Whoa Nelly!", "Zounds!", "Egads!", "Oh snap!", "Aack!", "Great balls of fire!"];
    var greet = randomPick(greetz);
    var repr = meta.user + '/' + meta.repo + ' (' + meta.name + ')';
    cb(greet + ' ' + commits.length + ' new commits to ' + repr + '!');
    
    commits.slice(0,4).forEach(function (commit) {
        cb('    * ' + commit.author.name + ': ' + commit.message);
    });
    
    var more = commits.length - 4;
    if (commits.length > 4) cb('    ... and ' + more + ' more!');
    cb('Githubs: http://github.com/'+meta.user+'/'+meta.repo
       +(meta.name === "master" ? "" : "/tree/"+meta.name));
}

function takeWhile(xs, f) {
    var acc = [];
    for (var i = 0; i < xs.length && f(xs[i]); i++);
    return xs.slice(0,i);
}

function randomPick(xs) {
    return xs[Math.floor(Math.random() * xs.length)];
}

