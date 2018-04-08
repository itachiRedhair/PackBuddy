'use strict';

var packingSchemaFixed = require('../assets/packingItems').packingItemsFixed;
var packingSchemaWeather = require('../assets/packingItems').packingItemWeather;
var fetchWeatherData = require('../utilities/weather').getWeatherData;

//constants
const packingStatus = require("./../constants").packingStatus;
const session = require("./../constants").session;

function createPackingList(destination, date, duration) {
    return new Promise((resolve, reject) => {
        fetchWeatherData(destination, date, duration)
            .then(data => {
                let customizedList = getWeatherBasedPackingList(data['temperatureMax']);
                const fixedList = JSON.parse(JSON.stringify(packingSchemaFixed));
                const keys = Object.keys(customizedList);
                keys.forEach(key => Object.assign(fixedList[key], customizedList[key]));
                // console.log(JSON.stringify(fixedList, null, 4));
                resolve(fixedList);
            }).catch(err => {
                // console.log('Error', err);
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

function setPackingSession(tripId, packingList) {
    console.log('in setpackingsession packingList', packingList);
    this.attributes[session.CURRENT_TRIP] = tripId;
    this.attributes[session.CURRENT_PACKING_LIST] = packingList;
    this.attributes[session.CURRENT_PACKING_ITEM] = 'null';
    this.attributes[session.CURRENT_PACKING_ITEM_KEY] = 'null';
    this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = 'null';
    this.attributes[session.CURRENT_PACKING_STATUS] = packingStatus.NOT_STARTED;
    console.log('in setpackingsession current_packing_list', this.attributes[session.CURRENT_PACKING_LIST]);
}

module.exports = { createPackingList, setPackingSession };