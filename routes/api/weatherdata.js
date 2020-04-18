let express = require('express');
let router = express.Router();
let fetch = require("node-fetch");
let locationhandler = require("./../../location-handler.js");

//let key = require("./../../data/keys.json").weatherapi;

router.get("/", async (req, res) => {
    let location = {
        lat: Number(req.query.lat),
        lon: Number(req.query.lon)
    }
    let closestProvince = locationhandler.getClosestProvince(location);
    //let result = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Noord-Brabant&appid=${key}&units=metric`);
    //let body = await (result.json());
    //console.log(body);

    res.status(200).end(`You are close to ${closestProvince.name}`)

    /*res.status(200).json({
        temperature: 20,
        unit: 'celcius',
        humidity: 80,
        rainChance: 10,
        message: 'Stay home, blijf thuis!',
        time: Date.now()
    });*/
});

module.exports = router;