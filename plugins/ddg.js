var http = require('http');
var querystring = require('querystring');
var sys = require('sys');

//http://duckduckgo.com/?q=techcrunch&o=x

module.exports = function(search, cb) {

    var client = http.createClient(80, 'duckduckgo.com');
    var query = querystring.stringify({q: search, o: 'x'});

    var request = client.request('POST', '?'+query, {host: 'duckduckgo.com'});
    request.on('response', function (response) {
        //console.log('STATUS: ' + response.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.on('data', function (chunk) {
            cb(chunk);
        });
    });
    request.end();
}
