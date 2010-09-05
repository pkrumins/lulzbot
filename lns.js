module.exports = function(url, cb) {
    var http = require('http');
    var querystring = require('querystring');
    var sys = require('sys');

    //throws an http:// in front if there isn't one
    function urlify(x) {
        if ( x.match(/(^http:\/\/)/) ) {
            return x;
        } else {
            return "http://"+x;
        }
    }

    var client = http.createClient(80, 'www.ln-s.net');
    var query = querystring.stringify({url: urlify(url)});

    var request = client.request('POST', '/home/api.jsp?'+query, {host: 'ln-s.net'});
    request.on('response', function (response) {
        //console.log('STATUS: ' + response.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.on('data', function (chunk) {
            //regexp means "three digits, space, ??!?!, any spaces, a newline or three"
            cb(chunk.toString('utf-8')
                          .match(/\d{3} (.+) *\n+/)[1]);
        });
    });
    request.end();
}
