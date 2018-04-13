
const getAllItemsData = require("./../utilities/ddbController").getAllItemsData;

function getIncompleteTripDetails(userId) {
    return new Promise((resolve, reject) => {
        getAllItemsData(userId).then(data => {

            console.log('at the start of get all items data, data->', data, 'data.Item=>', data.Item);

            if (!data.Item) {
                console.log('seems data.item is undefined, so returning null')
                resolve(null);
            }

            let tripList = data.Item.trip_list;

            console.log('in getallitemdata call, tripList=>', tripList)

            let tripKeys = Object.keys(tripList);

            if (tripKeys.length > 0) {
                let trip = tripList[tripKeys[0]];
                console.log('tripKeys->', tripKeys);
                console.log('tripList oth itme', trip);

                for (let categoryKey in trip.packing_list) {
                    let category = trip.packing_list[categoryKey];

                    if (category.all_packed === false || category.remind_later === true) {
                        resolve(trip);
                    }

                }

                resolve(null);

            } else {
                console.log('no trips here');
                resolve(null);
            }
        }).catch(err => {
            console.log('error in get all items data call,errr=>', err);
            reject(err);
        })
    })
}

module.exports = { getIncompleteTripDetails }