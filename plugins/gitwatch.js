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
            var key = Hash(branch).valuesAt(['user','repo','name']).join('/');
            
            if (!hactivity[key]) {
                hacktivity[key] = { branch : branch, commits : [] };
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
    this.watch = function (channel, resource, cb) {
        var where = Hash.zip(['user','repo','branch'], resource.split('/'));
        db.get(channel, function (err, ch, meta) {
            db.save(channel, Hash.tap(ch || {}, function (branches) {
                branches[where.name] = {
                    user : where.user,
                    repo : where.repo,
                    name : where.name,
                    lastCommit : undefined,
                };
            }));
        });
    };
    
    this.getCommits = function (cb) {
        var stream = db.stream();
        stream.on('error', cb);
        
        stream.on('data', function (channel, cmeta) {
            Hash(channel).forEach(function (branch) {
                github.getBranchCommits(
                    branch.user, branch.repo, branch.name,
                    function (commits) { cb(
                        null,
                        Hash.merge(branch, { channel : cmeta.key }),
                        commits
                    ) }
                );
            });
        });
    };
    
    this.getUpdated = function (cb) {
        this.getCommits(function (err, branch, commits) {
            if (err) { cb(err, branch); return }
            
            if (branch.lastCommit != commits[0].id) {
                db.save(branch.name, Hash.merge(branch, {
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
