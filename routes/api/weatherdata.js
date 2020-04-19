let express = require('express');
let router = express.Router();
let fetch = require("node-fetch");
let locationhandler = require("./../../location-handler.js");

let key = process.env.KEY || require("./../../data/keys.json").weatherapi;

Date.prototype.getWeekDay = function () {
    var weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return weekday[this.getDay()];
}

router.get("/", async (req, res) => {
    let location = {
        lat: Number(req.query.lat),
        lon: Number(req.query.lon)
    }
    let closestProvince = locationhandler.getClosestProvince(location);
    let result = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${closestProvince.id}&appid=${key}&units=metric`);
    let body = await (result.json());
    let compiledWeatherData = { test: "hello"};
    for (let index in body.list) {
        let weatherItem = body.list[index];
        let foundDate = new Date(weatherItem.dt * 1000);
        console.log(foundDate.getWeekDay());
        if (compiledWeatherData[foundDate.getWeekDay()] == null && foundDate.getHours() == 14) {
            let weatherDescription = weatherItem.weather[0]['main'];
            let rain = (weatherDescription == "Drizzle" || weatherDescription == "Thunderstorm" || weatherDescription == "Rain" || weatherDescription == "Snow");
            let object = {
                temp: weatherItem.main['feels_like'],
                chanceOfRain: rain
            }
            console.log(object);
            compiledWeatherData[foundDate.getWeekDay()] = object;
        }
    }
    console.log(compiledWeatherData);
    res.status(200).json(compiledWeatherData);
});

module.exports = router;