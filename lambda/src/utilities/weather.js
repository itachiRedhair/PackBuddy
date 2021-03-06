'use strict';

const fetch = require("node-fetch");
const packingSchemaWeather = require('../assets/packingItems').packingItemWeather;

function getWeatherData(city, date, duration) {
    return getLatLngByCity(city).then(location => {
        return new Promise((resolve, reject) => {
            let lat = location.lat;
            let lng = location.lng;

            fetch("https://api.darksky.net/forecast/f7b824470e8eb0bb1d8dd1e0e6c652cd/"
                + lat + "," + lng + "," + date
                + "?exclude=hourly,currently,minutely,flags&units=si")
                .then(res => res.json())
                .then(body => {
                    let weatherData = body.daily.data[0];
                    // console.log(weatherData);
                    resolve(weatherData);
                }).catch(err => {
                    // console.log('error while fetching weather', err);
                    reject(err);
                });
        })
    })
}

function getLatLngByCity(city) {
    return new Promise((resolve, reject) => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCz1ERY4zRYJzyqgMLIJRL_LdlOO38fSUM&address=" + city)
            .then(res => res.json())
            .then(body => {
                let location = body.results[0].geometry.location;
                resolve(location);
            }).catch(err => {
                // console.log('error while fetching lcoation', err);
                reject(err);
            });
    })
};



function getWeatherBasedPackingList(temperature) {
    let condition = getWeatherCondition(temperature);
    return packingSchemaWeather[condition];
}

function getWeatherCondition(temperature) {
    if (temperature <= 15) return 'cold';
    else if (temperature > 15 && temperature < 50) return 'hot';
    else return 'rainy';
}


module.exports = { getWeatherData, getWeatherBasedPackingList };