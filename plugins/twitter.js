var TwitterStream = require('evented-twitter').TwitterStream;
var sys = require('sys');

module.exports = function(user, pass, cb) {

    var twitStream = new TwitterStream(user, pass);

    //Should make tracking available like gitwatch
    var stream = twitStream.filter('json', {track: 'stackvm'});

    stream.on('ready', function() {
        stream.on('tweet', function(jsons) {
            //Checks for blank returns from twitter
            if(!String(jsons).trim()) return;
            try {
                handleTweet(JSON.parse(jsons), cb);
            } catch(e) {
                sys.debug('\nProblem parsing: ' + jsons);
                sys.debug(e.message);
                sys.debug(e.stack);
            }
        });

        stream.on('complete', function(response) {
            stream.close();
        });
    });

    stream.on('error', function(err) {
        sys.debug(err.message);
        throw err;
    });

    stream.start();

}

function handleTweet(tweet, cb) {
    cb('#stackvm', '\'\'< ♪: '+tweet.text+' -- '+tweet.user.screen_name+' ('+tweet.user.name+') \'\'< ♪');
    cb('#stackvm', 'Czech it out @ http://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id);
}
