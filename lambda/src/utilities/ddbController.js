'use strict';

let AWS = require('aws-sdk');
let constants = require('./../constants.js');

var documentClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});
var dynamodb = new AWS.DynamoDB();

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
                console.log("Error when calling DynamoDB");
                console.log(err, err.stack); // an error occurred
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
                console.log("Error when calling DynamoDB");
                console.log(err, err.stack); // an error occurred
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
        console.log('here in dynamodb with userId ', userId)
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            UpdateExpression: "SET trip_list." + tripEntry['trip_id'] + " = :trip_info, last_trip_key = :last_trip_val",
            ExpressionAttributeValues: {
                ":trip_info": tripEntry,
                ":last_trip_val":  tripEntry['trip_id']
            }
        };

        documentClient.update(params, (err, data) => {
            if (err) {
                console.log("Error when calling DynamoDB");
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

function updateTrip(userId, editThis) {
    return new Promise((resolve, reject) => {
        console.log('here in dynamodb with userId ', userId)
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            UpdateExpression: "SET trip_list." + "" + " = :value",
            ExpressionAttributeValues: {
                ":value": editThis
            }
        };

        documentClient.update(params, (err, data) => {
            if (err) {
                console.log("Error when calling DynamoDB");
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // console.log(data); // successful response
                resolve(data);
            }
        });
    });
}


module.exports = { insertTrip, getFromDDB, updateTrip, getLastTripID }