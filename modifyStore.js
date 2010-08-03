var configfile = './gitwatch.db';
var sys = require('sys');
var nStore = require('nStore');
var repl = require('repl');

//global so that the repl may access it.
watchdb = nStore(configfile);

repl.start();
