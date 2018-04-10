'use strict';

let AWS = require('aws-sdk');
let constants = require('./../constants.js');
let session = require('./../constants.js').session;

//setting environment variable
var env = process.env.NODE_ENV || 'development';

if(env==='development'){
    AWS.config.update({
        "apiVersion": "2012-08-10",
        "accessKeyId": "abcde",
        "secretAccessKey": "abcde",
        "region":"us-east-1",
        "endpoint": "http://localhost:3333"
      });
}

var documentClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

function getLastTripID(userId) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            ProjectionExpression: 'last_trip_key'
        };

        documentClient.get(params, (err, data) => {
            if (err) {
                // console.log("Error when calling DynamoDB");
                // console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                //console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

function getFromDDB(userId) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            }
        };

        documentClient.get(params, (err, data) => {
            if (err) {
                // console.log("Error when calling DynamoDB");
                // console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                //console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

function insertTrip(userId, tripEntry) {
    return new Promise((resolve, reject) => {
        // console.log('here in dynamodb with userId ', userId)
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            UpdateExpression: "SET trip_list.#ti = :trip_info, last_trip_key = :last_trip_val",
            ExpressionAttributeValues: {
                ":trip_info": tripEntry,
                ":last_trip_val": tripEntry['trip_id']
            },
            ExpressionAttributeNames: {
                "#ti": tripEntry["trip_id"]
            },
            // UpdateExpression: "SET trip_list.#ti = if_not_exists( trip_list.#ti, :trip_info), last_trip_key = if_not_exists( last_trip_key,:last_trip_val)"
        };

        documentClient.update(params, (err, data) => {
            if (err) {
                // console.log("Error when calling DynamoDB");
                // console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

function updatePackingList() {
    let userId = this.event.session.user.userId;
    let tripId = this.attributes[session.CURRENT_TRIP];
    let packingList = this.attributes[session.CURRENT_PACKING_LIST];
    let packingStatus = this.attributes[session.CURRENT_TOTAL_PACKING_STATUS];
    return new Promise((resolve, reject) => {
        // console.log('here in dynamodb with userId ', userId)
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            UpdateExpression: "SET trip_list.#ti.packing_list = :pl , trip_list.#ti.packing_status=:ps",
            ExpressionAttributeValues: {
                ":pl": packingList,
                ":ps": packingStatus
            },
            ExpressionAttributeNames: {
                "#ti": tripId
            },
        };

        documentClient.update(params, (err, data) => {
            if (err) {
                // console.log("Error when calling DynamoDB");
                // console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // console.log(data); // successful response
                resolve(data);
            }
        });
    });
}


module.exports = { insertTrip, getFromDDB, updatePackingList, getLastTripID }
