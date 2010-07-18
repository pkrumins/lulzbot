var sys = require('sys');
var YQL = require('yql');

exports.getWeather = function getWeather (location, callback) {
    new YQL.exec("select * from weather.woeid where w in (select woeid from geo.places where text=@location limit 1)", function(response) {
        //TODO: Handlers for less expected errors
        if (response.query.results.rss.channel.item.title === "City not found") {
            callback("Error: "+response.query.results.rss.channel.item.title);
        } else {
            var location = response.query.results.rss.channel.location;
            var condition = response.query.results.rss.channel.item.condition
            var units = response.query.results.rss.channel.units
            var forecast = response.query.results.rss.channel.item.forecast
            //Some locations have a blank region. TODO: Look for this.
            callback(location.city+", "+location.region+":");
            callback("Now: "+condition.text+", "+condition.temp+" ("+units.temperature+")");
            callback("Today: "+forecast[0].text+", "+forecast[0].high+"/"+forecast[0].low+" ("+units.temperature+")")
            callback("Tomorrow: "+forecast[1].text+", "+forecast[1].high+"/"+forecast[1].low+" ("+units.temperature+")")
        }
    },{"location": location, "env": "store://datatables.org/alltableswithkeys"}); 
}
