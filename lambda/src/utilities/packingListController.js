'use strict';

var packingSchemaFixed = require('../assets/packingItems').packingItemsFixed;
var packingSchemaWeather = require('../assets/packingItems').packingItemWeather;
var fetchWeatherData = require('../utilities/weather').getWeatherData;

//constants
const packingStatus = require("./../constants").packingStatus;
const packingItemStatus = require("./../constants").packingItemStatus;
const session = require("./../constants").session;

function createPackingList(destination, date, duration) {
    return new Promise((resolve, reject) => {
        fetchWeatherData(destination, date, duration)
            .then(data => {
                let customizedList = getWeatherBasedPackingList(data['temperatureMax']);
                const fixedList = JSON.parse(JSON.stringify(packingSchemaFixed));
                const keys = Object.keys(customizedList);
                keys.forEach(key => Object.assign(fixedList[key]['items'], customizedList[key]['items']));
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
    // console.log('in setpackingsession packingList', packingList);
    this.attributes[session.CURRENT_TRIP] = tripId;
    this.attributes[session.CURRENT_PACKING_LIST] = packingList;
    this.attributes[session.CURRENT_PACKING_ITEM] = 'null';
    this.attributes[session.CURRENT_PACKING_ITEM_KEY] = 'null';
    this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = 'null';
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.NOT_STARTED;
    this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS] = packingStatus.NOT_STARTED;
    // console.log('in setpackingsession current_packing_list', this.attributes[session.CURRENT_PACKING_LIST]);
}

function getNotPackedCategories(){
    let packingList=this.attributes[session.CURRENT_PACKING_LIST];
    let categories=[];
    for(var categoryKey in packingList){

        // let allPacked=true;
        // for(var itemKey in packingList[categoryKey].items){

        //     let item=packingList[categoryKey].items[itemKey]
        //     if(item.status===packingItemStatus.NOT_PACKED){
        //         allPacked=false;
        //         break;
        //     }
        // }

        let allPacked=packingList[categoryKey]['all_packed'];
        
        if(!allPacked){
            categories.push(categoryKey)
        }
    }
    return categories
}

function getRemindMeStatus(){
    let packingList=this.attributes[session.CURRENT_PACKING_LIST];

    for(var categoryKey in packingList){

        for(var itemKey in packingList[categoryKey].items){

            let item=packingList[categoryKey].items[itemKey]
            if(item.status===packingItemStatus.REMIND_LATER){
                return true;
            }
        }
    }
    return false;
}

function resetRemindMePackingList(){
    let packingList=this.attributes[session.CURRENT_PACKING_LIST];

    for(var categoryKey in packingList){

        for(var itemKey in packingList[categoryKey].items){

            let item=packingList[categoryKey].items[itemKey]
            if(item.status===packingItemStatus.REMIND_LATER){
                this.attributes[session.CURRENT_PACKING_LIST][categoryKey]['items'][itemKey]['status']=packingItemStatus.NOT_PACKED;
                this.attributes[session.CURRENT_PACKING_LIST][categoryKey]['all_packed']=false;
            }
        }
    }
}


module.exports = { createPackingList, setPackingSession, getNotPackedCategories, getRemindMeStatus, resetRemindMePackingList };