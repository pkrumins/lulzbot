var fs = require('fs');
var github = new (require('github').GitHubApi)(true).getCommitApi();
var sys = require('sys');
var Hash = require('traverse/hash');

var nStore = require('nStore');
var watchlist = {};

exports.gitwatch = function (cb) { 
    var branches = new Branches(
        nStore(__dirname + '/gitwatch/gitwatch.db')
    );
    
    setInterval(function () {
        var hacktivity = {};
        branches.getUpdated(function (err, branch, commit) {
            if (err) { console.log('Error: %s', err); return }
            
            if (!hactivity[branch.key]) {
                hacktivity[branch.key] = { branch : branch, commits : [] };
            }
            hacktivity[key].commits.push(commit);
        });
        
        Hash(hacktivity).forEach(function (repo) {
            repo.channels.forEach(function (channel) {
                prepareMessage(repo, function (msg) {
                    cb(channel, msg);
                });
            });
        });
    }, 30000);
};

function prepareMessage (repo, cb) {
    var greetz = ["Whoa Nelly!", "Zounds!", "Egads!", "Oh snap!", "Aack!"];
    var greet = greetz[ Math.floor(Math.random() * greetz.length) ];
    
    var b = repo.branch;
    var name = b.user + '/' + b.repo + '/ (' + b.name + ')';
    
    var commits = repo.commits;
    
    cb(greet + ' ' + commits.length + ' new commits to ' + name + '!');
    
    commits.slice(0,4).forEach(function (commit) {
        cb('    * ' + commit.author.name + ': ' + commit.message);
    });
    
    var more = commits.length - 4;
    if (commits.length > 4) cb('    ... and ' + more + ' more!');
}

function Branches (db) {
    this.watch = function (channel, key, cb) {
        var where = Hash.zip(['user','repo','branch'], key.split('/'));
        db.get(key, function (err, branch, meta) {
            db.save(key, Hash.merge(branch || {}, {
                channels : (branch.channels || []).concat([ channel ]),
                user : where.user,
                repo : where.repo,
                name : where.name,
                key : key,
            }));
        });
    };
    
    this.getCommits = function (cb) {
        var stream = db.stream();
        stream.on('error', cb);
        stream.on('data', function (branch, cmeta) {
            github.getBranchCommits(
                branch.user, branch.repo, branch.name,
                function (commits) { cb(null, branch, commits) }
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
}

function takeWhile(xs, f) {
    var acc = [];
    for (var i = 0; i < xs.length && f(xs[i]); i++);
    return xs.slice(0,i);
}
