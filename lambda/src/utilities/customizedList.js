'use strict';

const getWeatherData = require("./weather").getWeatherData;
const getWeatherBasedPackingList = require("./weather").getWeatherBasedPackingList;
const packingItemGender = require('../assets/packingItems').packingItemGender;


function getWeatherCustomizedList(destination, date, duration) {
    return new Promise((resolve, reject) => {
        getWeatherData(destination, date, duration)
            .then(data => {
                let customizedList = getWeatherBasedPackingList(data['temperatureMax']);
                resolve(customizedList);
            }).catch(err => {
                // console.log('Error', err);
                reject(err);
            })
    })
}

function getGenderCustomizedList(gender) {
    return new Promise((resolve, reject) => {
        switch (gender) {
            case "male":
                resolve(packingItemGender['male']);
                break;
            case "female":
                resolve(packingItemGender['female']);
                break;
            default:
                resolve({})
        }
    })
}

module.exports = { getWeatherCustomizedList, getGenderCustomizedList }