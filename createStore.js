var configfile = './gitwatch.json';
var sys = require('sys');
var fs = require('fs');
var nStore = require('nStore');
var watchlist;

var watchdb = nStore('gitwatch.db');

fs.readFile(configfile, 'utf-8', function (err,stream) {
    if (err) {throw err;}
    watchlist = JSON.parse(stream);
    watchlist.forEach(function (entry) {
        //sys.puts(entry.user);
        //sys.puts(sys.inspect(entry.repos));
        watchdb.save(entry.user,entry.repos, function (err) {if (err) throw err;});
    });
});
