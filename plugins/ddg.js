var http = require('http');
var querystring = require('querystring');

var lns = http.createClient(80, 'ln-s.net');
var query = ddg.request('GET', '/', {host: 'ln-s.net'});
query.write(querystring.stringify({q: 'techcrunch', o: 'x'}));
query.on('response', function (response) {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.on('data', function (chunk) {
        console.log('BODY: '+ chunk);
    });
});
query.end();
