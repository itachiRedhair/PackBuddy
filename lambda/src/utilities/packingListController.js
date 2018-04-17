'use strict';

var packingSchemaFixed = require('../assets/packingItems').packingItemsFixed;
var packingSchemaWeather = require('../assets/packingItems').packingItemWeather;

const fetchWeatherCustomizedList = require("./customizedList").getWeatherCustomizedList;
const getGenderCustomizedList = require("./customizedList").getGenderCustomizedList;

//constants
const packingStatus = require("./../constants").packingStatus;
const packingItemStatus = require("./../constants").packingItemStatus;
const session = require("./../constants").session;

function createPackingList(destination, date, duration) {
    let userInfo = this.attributes[session.USER_INFO];
    console.log('inside createpackinglsit,userinfo=>', userInfo);
    return new Promise((resolve, reject) => {
        getCustomizedLists(userInfo, destination, date, duration).then(customizedListArray => {
            const fixedList = JSON.parse(JSON.stringify(packingSchemaFixed));
            console.log("fixedList=>", fixedList);

            customizedListArray.forEach(customizedList => {
                const keys = Object.keys(customizedList);
                keys.forEach(key => Object.assign(fixedList[key]['items'], customizedList[key]['items']));
            })

            console.log("packingList=>", fixedList);
            resolve(fixedList);
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    });
}

function getCustomizedLists(userInfo, destination, date, duration) {
    return new Promise((resolve, reject) => {

        let getWeatherPackingList = fetchWeatherCustomizedList(destination, date, duration);

        let promiseArr = [getWeatherPackingList];

        if (userInfo && userInfo.gender) {
            let getGenderPackingList = getGenderCustomizedList(userInfo.gender);
            promiseArr.push(getGenderPackingList);
        }

        Promise.all(
            promiseArr
        ).then(customizedListArray => {
            console.log('customizeListArray=>,', customizedListArray)
            resolve(customizedListArray);
        })
    })
}



function setPackingSession(trip) {
    // console.log('in setpackingsession packingList', packingList);
    this.attributes[session.CURRENT_TRIP] = trip.trip_id;
    this.attributes[session.CURRENT_PACKING_LIST] = trip.packing_list;
    this.attributes[session.CURRENT_PACKING_ITEM] = 'null';
    this.attributes[session.CURRENT_PACKING_ITEM_KEY] = 'null';
    this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = 'null';
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.STARTED;
    this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS] = packingStatus.NOT_STARTED;
    this.attributes[session.PROMPT_QUEUE] = [];
    // console.log('in setpackingsession current_packing_list', this.attributes[session.CURRENT_PACKING_LIST]);
}

function getNotPackedCategories() {
    let packingList = this.attributes[session.CURRENT_PACKING_LIST];
    let categories = [];

    for (var categoryKey in packingList) {
        let allPacked = packingList[categoryKey]['all_packed'];
        if (!allPacked) {
            categories.push(categoryKey);
        }
    }

    return categories;
}

function getRemindMeStatus() {
    let packingList = this.attributes[session.CURRENT_PACKING_LIST];

    for (var categoryKey in packingList) {
        let remindMeLaterStatus = packingList[categoryKey]['remind_later']
        if (remindMeLaterStatus) {
            return true;
        }
    }
    return false;
}

function resetRemindMePackingList() {
    let packingList = this.attributes[session.CURRENT_PACKING_LIST];

    for (var categoryKey in packingList) {

        for (var itemKey in packingList[categoryKey].items) {

            let item = packingList[categoryKey].items[itemKey]
            if (item.status === packingItemStatus.REMIND_LATER) {
                this.attributes[session.CURRENT_PACKING_LIST][categoryKey]['items'][itemKey]['status'] = packingItemStatus.NOT_PACKED;
                this.attributes[session.CURRENT_PACKING_LIST][categoryKey]['all_packed'] = false;
            }
        }
        this.attributes[session.CURRENT_PACKING_LIST][categoryKey]['remind_later'] = false;
    }
}


module.exports = { createPackingList, setPackingSession, getNotPackedCategories, getRemindMeStatus, resetRemindMePackingList };