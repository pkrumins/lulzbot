var sys = require('sys');
var YQL = require('yql');

getWeather("Beverly Hills", sys.puts);

function getWeather(zip, callback) {
    new YQL.exec("select * from weather.woeid where w in (select woeid from geo.places where text=@zip limit 1)", function(response) {
        var location = response.query.results.rss.channel.location;
        var condition = response.query.results.rss.channel.item.condition
        var units = response.query.results.rss.channel.units
        callback("Weather in "+location.city+", "+location.region+": "+condition.temp+" "+units.temperature+", "+condition.text);
        },{"zip": zip, "env": "store://datatables.org/alltableswithkeys"}); 
}

//env=store://datatables.org/alltableswithkeys
