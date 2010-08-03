var sys = require('sys');
var YQL = require('yql');

exports.getWeather = function getWeather (location, callback) {
    new YQL.exec("select * from weather.woeid where w in (select woeid from geo.places where text=@location limit 1)", function(response) {
        //TODO: Handlers for less expected errors
        if (response.query.results.rss.channel.item.title === "City not found") {
            callback("Error: "+response.query.results.rss.channel.item.title);
        } else {
            var location = response.query.results.rss.channel.location;
            var condition = response.query.results.rss.channel.item.condition;
            var units = response.query.results.rss.channel.units;
            var forecast = response.query.results.rss.channel.item.forecast;

            condits = function(text) {
                var lut = { "Showers": "☔",
                            "Light Rain": "☔☔", 
                            "Rain": "☔☔☔",
                            "Cloudy": "☁☁☁",
                            "Mostly Cloudy": "☁☼☁",
                            "Partly Cloudy": "☁☼", 
                            "Partly Sunny": "☁☼",
                            "Mostly Sunny": "☼☁☼",
                            "Sunny": "☼☼☼",
                            "Clear": " ☼ ",
                            "Snow": "❄" };

                return (lut[text]==null ? text : lut[text]+"("+text+")");
            }

            //Some locations have a blank region, so we use the country instead.
            //Currently untested.
            if (location.region=="") {
                callback(location.city+", "+location.country+":");
            } else {
                callback(location.city+", "+location.region+":");
            }
            callback("Now: "+condits(condition.text)+", "+condition.temp+" ("+units.temperature+")");
            callback("Today: "+condits(forecast[0].text)+", "+forecast[0].high+"/"+forecast[0].low+" ("+units.temperature+")");
            callback("Tomorrow: "+condits(forecast[1].text)+", "+forecast[1].high+"/"+forecast[1].low+" ("+units.temperature+")");
        }
    },{"location": location, "env": "store://datatables.org/alltableswithkeys"}); 
}
