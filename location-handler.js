let { headingDistanceTo } = require('geolocation-utils');
let provinces = require("./data/provinces.json");

let getClosestProvince = (baseLocation) => {
    let provinceCopy = provinces;
    let finalProvince;
    for (let index in provinceCopy.provinces) {
        let province = provinceCopy.provinces[index];
        let provinceLocation = {
            lat: province.lat,
            lon: province.lon
        }
        let distance = calculateDistance(baseLocation, provinceLocation);
        province.distance = distance;
        if (finalProvince == null) finalProvince = province;
        if (finalProvince.distance > province.distance) finalProvince = province;
    }
    return finalProvince;
};

let calculateDistance = (firstLocation, secondLocation) => {
    return headingDistanceTo(firstLocation, secondLocation).distance;
}

exports.getClosestProvince = getClosestProvince;