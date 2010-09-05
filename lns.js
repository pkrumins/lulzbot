var http = require('http');
var querystring = require('querystring');

var lns = http.createClient(80, 'ln-s.net');
var query = ddg.request('GET', '/home/api.jsp');
query.write(querystring.stringify({url: 'www.google.com'}));
query.on('response', function (response) {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.on('data', function (chunk) {
        console.log('BODY: '+ chunk);
    });
});
query.end();
