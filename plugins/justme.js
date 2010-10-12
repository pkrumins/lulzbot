module.exports = function (url, cb) {
    var http = require('http');
    var querystring = require('querystring');
    var sys = require('sys');

    var urlbase = 'downforeveryoneorjustme.com';

    //Parser. Finding this logic annoying yet? :v
    var parser = parsnip(function (e, dom) {
        if (e) { 
            console.log('Error in dfeojm: '+e);
        } else {
            dom.forEach(function (x) {
                x.children.forEach(function (y) {
                    if (y.name == "head") {
                        y.children.forEach(function (z) {
                            if (z.name == "title") {
                                cb( z.children[0].data );
                                cb( "http://" + urlbase 
                                  + '/' + url);
                            }
                        });
                    }
                });
            });
        }
    });

    var client = http.createClient(80, urlbase);
    var request = client.request('GET', '/'+url, {host: urlbase});
    request.on('response', function (response) {
        response.on('data', function (chunk) {
            parser.parseChunk(chunk);
        });
        response.on('end', function() {
            parser.done();
        });
    });
    request.end();
}

//htmlparser has a stupid api
//This only helps a LITTLE
function parsnip (cb) {
    var htmlparser = require('htmlparser');
    return parser = new htmlparser.Parser(new htmlparser.DefaultHandler(cb));
}
