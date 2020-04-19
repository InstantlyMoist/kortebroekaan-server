let schedule = require('node-schedule');
let provinces = require('./data/provinces.json');
let fetch = require('node-fetch');
let key = require("./data/keys.json").weatherapi;

console.log("hello world");

schedule.scheduleJob('*/10 * * * *', async (fireDate) => {
    let finalIDString = "";
    for (let index in provinces.provinces) {
        let province = provinces.provinces[index];
        finalIDString += `${province.id},`
    }
    finalIDString = finalIDString.substr(0, finalIDString.length - 1);
    let response = await fetch(`http://api.openweathermap.org/data/2.5/group?id=${finalIDString}&appid=${key}&units=metric)`);
    let body = await response.json();
    console.log(body);
});