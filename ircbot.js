//Maushu's __announcer

var sys = require('sys'),
	http = require('http'),
	querystring = require('querystring'),
	base64 = require('./lib/base64'),
	Buffer = require('buffer').Buffer,
	Irc = require('./vendor/IRC/lib/irc');

var twitter_auth = { user: "<TWITTER_USERNAME>", pass: "<TWITTER_PASSWORD>"};

var google_api_key = "<GOOGLE_API_KEY>";
	
var irc_options = 
	{ server: '<IRC_SERVER>'
	, nick: '<IRC_NICK>'
	, channel: '<IRC_CHANNEL>'
	, user:
		{ username: 'announcer'
		, hostname: 'intertubes'
		, servername: 'graphnode'
		, realname: 'Node.js Announcer'
		}
	};

//Twitter
var tweets = [];

process.addListener('uncaughtException', function (err) {
  sys.puts('Caught exception: ' + err);
});

var bot = new Irc(irc_options || {});

// Connect the irc bot.
bot.connect(function() {
	this.join(bot.options.channel);
});

// Messages received from the channel.
bot.addListener('privmsg', function(message) {
	/*
	if (message.params[0].toLowerCase() == bot.options.channel.toLowerCase() && message.params[1].charAt(0) == "!") {
		switch(message.params[1].toLowerCase()) {
			case "!cmd":
				break;
		}
	}
	*/
});

// Good ol' log.
function log(text) {
	sys.puts('[' + (new Date()) +  '] ' + text);
}

// Twitter section.
function checkTweets() {
	var LINE_REGEX = /^(.+?)\r\n/;

	var input = "";
	//Note use of querystring.stringify.
	var query = querystring.stringify({ track: 'nodejs,node js' });
    //Note: uses basic auth, should convert to oauth
	var headers = { 'Host': 'stream.twitter.com', 'Authorization': 'Basic ' + base64.encode(twitter_auth.user + ':' + twitter_auth.pass) };
    //Note: Uses streaming api
	var client = http.createClient(80, 'stream.twitter.com');
	client.setTimeout(1000 * 60 * 5);
	
	var request = client.request('GET', '/1/statuses/filter.json?' + query, headers);
	request.addListener('response', function(response) {
		response.setEncoding('utf8');
		log('Starting twitter stream listener...');
	
		response.addListener('data', function(chunk) {
			if (chunk != "\r\n")
				input += chunk;
				
			var match, tweet, msg;
			
			while (match = input.match(LINE_REGEX)) {
				input = input.substr(match[0].length);

				try {
					tweet = JSON.parse(match[1]);
				} catch (e) {
					log("ERROR: invalid JSON request");
				}
				
				// Check if it's a bad retweet or if the user has less than 5 friends (might be a bot!)
				if (tweet.user.friends_count >= 5 && tweet.text.match(/(^|\s)RT @([^\s]+)/) == null && tweet.text.match(/\svia\s|via\s@(\w+)/) == null) {

					var tweet_text = tweet.text.replace(/(\r|\n)/g, ' ');
				
					// Translate if necessary.
					translate(tweet_text, function(result) {
						var text = result.translatedText, lang = result.detectedSourceLanguage;
						//var text = tweet.text.replace(/(\r|\n)/g, ' '), lang = "en";
					
						// Use Levenshtein distance to see if there were similar tweets.
						var found = false;
						for(var i = tweets.length-1; i >= 0; i--) {
							if (levenshtein(text, tweets[i]) < 25) {
								found = true;
								break;
							}
						}
						
						if (!found) {
							tweets.push(text);
							if (tweets.length > 100) tweets.shift();
							
							msg = '\u0002Twitter:\u000f "\u000f' + ((lang != "en") ? text : tweet_text) + '\u000f"';
							if (lang != "en") msg += ' [' + lang + ']';
							msg += ' -- ' + tweet.user.name + '. ' + 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id;
							bot.privmsg(bot.options.channel, msg);
							log('Received tweet.');
						} else {
							log('Ignored tweet, too similar to old tweet in memory.');
						}
					});
				} else {
					log('Ignore tweet, might\'ve been a RT or from a bot.');
				}
			}
		});
	
		response.addListener('error', function(err) {
			log('Error while receiving tweets: ' + err);
			log('Restarting...');
			setTimeout(checkTweets, 3000);
		});
	
		response.addListener('end', function() {
			log('Twitter stream timed out. Restarting...');
			setTimeout(checkTweets, 3000);
		});
	});
	request.end();
}

function translate(text, callback) {
	var query = querystring.stringify({ v: "1.0", q: text, langpair: "|en", key: google_api_key })
	var request = http.createClient(80, 'ajax.googleapis.com').request('GET', '/ajax/services/language/translate?' + query, {'host': 'ajax.googleapis.com'});
	
	request.addListener('response', function(response) {
		response.setEncoding('utf8');
		
		var data = "";
		
		response.addListener('data', function(chunk) {
			data += chunk;
		});
		
		response.addListener('end', function() {		
			var obj = JSON.parse(data);
			if (obj.responseStatus == "200")
				callback(obj.responseData);
			else {
				log("Error while translating: " + data);
				callback({ translatedText: text, detectedSourceLanguage: "en" });
			}
		});
	});
	request.end();
}

function levenshtein(s1, s2) {
      // http://kevin.vanzonneveld.net
      // +            original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
      // +            bugfixed by: Onno Marsman
      // +             revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
      // + reimplemented by: Brett Zamir (http://brett-zamir.me)
      // + reimplemented by: Alexander M Beedie
      // *                example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
      // *                returns 1: 3

    if (s1 == s2) {
        return 0;
    }

    var s1_len = s1.length;
    var s2_len = s2.length;
    if (s1_len === 0) {
        return s2_len;
    }
    if (s2_len === 0) {
        return s1_len;
    }

    // BEGIN STATIC
    var split = false;
    try{
        split=!('0')[0];
    } catch (e){
        split=true; // Earlier IE may not support access by string index
    }
    // END STATIC
    if (split){
        s1 = s1.split('');
        s2 = s2.split('');
    }

    var v0 = new Array(s1_len+1);
    var v1 = new Array(s1_len+1);

    var s1_idx=0, s2_idx=0, cost=0;
    for (s1_idx=0; s1_idx<s1_len+1; s1_idx++) {
        v0[s1_idx] = s1_idx;
    }
    var char_s1='', char_s2='';
    for (s2_idx=1; s2_idx<=s2_len; s2_idx++) {
        v1[0] = s2_idx;
        char_s2 = s2[s2_idx - 1];

        for (s1_idx=0; s1_idx<s1_len;s1_idx++) {
            char_s1 = s1[s1_idx];
            cost = (char_s1 == char_s2) ? 0 : 1;
            var m_min = v0[s1_idx+1] + 1;
            var b = v1[s1_idx] + 1;
            var c = v0[s1_idx] + cost;
            if (b < m_min) {
                m_min = b; }
            if (c < m_min) {
                m_min = c; }
            v1[s1_idx+1] = m_min;
        }
        var v_tmp = v0;
        v0 = v1;
        v1 = v_tmp;
    }
    return v0[s1_len];
}

// Start the stuff.
checkTweets();
