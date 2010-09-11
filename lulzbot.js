#!/usr/bin/env node

/*
This is a script that runs all the necessary processes for me.  Ideally, we'd
have some generalized mix of isaac's Supervisor and lrbabe's d.js, but for now
this ad-hoc solution will do. Assuming it works.
*/

require('optimist')
    .usage('Usage: $0 OPTIONS\n'
        + '    Required OPTIONS: --server --nick\n'
        + '    Other OPTIONS: --username --realname --channel')
    .demand([ 'server', 'nick' ]);

var fs = require('fs');
var spawn = require('child_process').spawn;
var sys = require('sys');

//A generalized function that runs things and watches things
function run(runthis, args, watchthese) {
    var running = spawn('node', [runthis].concat(args));
    running.on('exit', function () {
        run(runthis, args, watchthese);
    });
    if (!watchthese) {
        var watchthese = [];
    }
    watchthese.concat([runthis]).forEach(function (file) {
        fs.watchFile(file, function () {
            sys.puts(runthis+': '+file+' updated! Going to restart...');
            //kills the services so that exit event can restart it. Hopefully.
            try { running.kill() }
            catch (err) {
                console.log(err.toString());
            }
            //cleanup
            watchthese.forEach(fs.unwatchFile);
        });
    });
    running.stdout.on('data', function(data) {
        sys.puts(runthis+': '+ data.toString("utf-8"));
    });
    running.stderr.on('data', function(data) {
        sys.puts(runthis+' ERROR: '+ data.toString("utf-8"));
    });
}

//Run everything
if (process.argv[2] === '-sync') {
    var synchronize = run(__dirname + '/bin/synchronize.js');
}
var relay = run(__dirname + '/bin/relay.js', process.argv.slice(2));
var services = run(__dirname + '/bin/services.js', [],
    ['branch.js', 'gitwatch.js', 'lns.js', 'onscreen.js' ]
    .map(function (x) { return './plugins/' + x })
);
