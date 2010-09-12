var TwitterStream = require('evented-twitter').TwitterStream;
var sys = require('sys');
var argv = require('optimist').argv;

module.exports = function(argv.user, argv.pass) {


    var twitter = new TwitterStream(username, pass);

    var params = {'track':'Beck'};

    // statuses/sample from streaming api
    var stream = twitter.filter('json', params);

    stream.addListener('ready', function() {
        stream.addListener('tweet', function(tweet) {
            if(!String(tweet).trim()) return;
            try {
                // The result is not parsed for you
                var t = JSON.parse(tweet);
                sys.puts(sys.inspect(t));
            } catch(e) {
                sys.debug('\nProblem parsing: ' + tweet);
                sys.debug(e.message);
                sys.debug(e.stack);
            }
        });

        stream.addListener('complete', function(response) {
            stream.close();
        });
    });

    stream.addListener('error', function(err) {
        sys.debug(err.message);
        throw err;
    });

    stream.start();
}
