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

    var client = http.createClient(80, 'www.furryurl.com');
    var query = querystring.stringify({url: urlify(url)});

    var request = client.request('POST', '/api-create.php?'+query, {host: 'furryurl.com'});
    request.on('response', function (response) {
        response.on('data', function (chunk) {
            cb(chunk.toString('utf-8'));
        });
    });
    request.end();
}
