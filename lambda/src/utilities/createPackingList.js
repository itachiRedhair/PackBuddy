var packingSchemaFixed = require('../assets/packingItems').packingItemsFixed;
var packingSchemaWeather = require('../assets/packingItems').packingItemWeather;
var fetchWeatherData = require('../utilities/weather').getWeatherData;


function createPackingList(destination, date, duration) {
    return new Promise((resolve, reject) => {
        fetchWeatherData(destination, date, duration)
            .then(data => {
                let customizedList = getWeatherBasedPackingList(data['temperatureMax']);
                const fixedList = JSON.parse(JSON.stringify(packingSchemaFixed));
                const keys = Object.keys(customizedList);
                keys.forEach(key => Object.assign(fixedList[key], customizedList[key]));
                console.log(JSON.stringify(fixedList, null, 4));
                resolve(fixedList);
            }).catch(err => {
                console.log('Error', err);
                reject(err);
            })

    });
}

function getWeatherBasedPackingList(temperature) {
    let condition = getWeatherCondition(temperature);
    return packingSchemaWeather[condition];
}

function getWeatherCondition(temperature) {
    if (temperature <= 15) return 'cold';
    else if (temperature > 15 && temperature < 50) return 'hot';
    else return 'rainy';
}

module.exports = createPackingList;