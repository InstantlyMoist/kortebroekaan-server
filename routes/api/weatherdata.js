let fs = require('fs');
let express = require('express');
let router = express.Router();
let fetch = require("node-fetch");
let locationhandler = require("./../../location-handler.js");
let key = process.env.KEY || require("./../../data/keys.json").weatherapi;
let cache = require("./../../data/cache.json");

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
    let data = await getOrUpdateCache(closestProvince.id);
    res.status(200).json({
        data: data,
        province: closestProvince.name
    });
});

let getOrUpdateCache = async (provinceID) => {
    if (cache[provinceID] != null) {
        if (cache[provinceID]["expire"] > Date.now()) {
            return cache[provinceID].data;
        }
    }

    let compiledWeatherData = {};
    let todayResult = await fetch(`http://api.openweathermap.org/data/2.5/weather?id=${provinceID}&appid=${key}&units=metric`);
    let todayBody = await todayResult.json();
    let today = new Date(Date.now()).getWeekDay();
    let todayWeatherDescription = todayBody.weather[0]['main'];
    let todayRain = (todayWeatherDescription == "Drizzle" || todayWeatherDescription == "Thunderstorm" || todayWeatherDescription == "Rain" || todayWeatherDescription == "Snow");
    let todayObject = {
        temp: todayBody.main['temp'],
        chanceOfRain: todayRain
    }
    compiledWeatherData[today] = todayObject;
    let result = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${provinceID}&appid=${key}&units=metric`);
    let body = await result.json();
    for (let index in body.list) {
        let weatherItem = body.list[index];
        let foundDate = new Date(weatherItem.dt * 1000);
        if (foundDate.getWeekDay == today) return;
        if (compiledWeatherData[foundDate.getWeekDay()] == null && (foundDate.getHours() == 14) || foundDate.getHours() == 15) {
            let weatherDescription = weatherItem.weather[0]['main'];
            let rain = (weatherDescription == "Drizzle" || weatherDescription == "Thunderstorm" || weatherDescription == "Rain" || weatherDescription == "Snow");
            let object = {
                temp: weatherItem.main['temp'],
                chanceOfRain: rain
            }
            compiledWeatherData[foundDate.getWeekDay()] = object;
        }
    }
    cache[provinceID] = {
        data: compiledWeatherData,
        expire: Date.now() + (30 * 60 * 1000)
    }
    fs.writeFileSync("./data/cache.json", JSON.stringify(cache));
    return compiledWeatherData;
}

module.exports = router;