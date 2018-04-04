'use strict';

let AWS = require('aws-sdk');
let constants = require('./../constants.js');

var documentClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

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

function insertTrip(userId) {
    return new Promise((resolve, reject) => {
        console.log('here in dynamodb with userId ', userId)
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            UpdateExpression: "SET trip_list = :trip_info",
            ExpressionAttributeValues: {
                ":trip_info": {
                    "trip_name": "pune_ngp",
                    "packing_list": {
                        "essentials": [
                            {
                                "name": "toothbrush",
                                "isPacked": false
                            },
                            {
                                "name": "phone charger",
                                "isPacked": false
                            }
                        ],
                        "clothing": [
                            {
                                "name": "shirt",
                                "isPacked": false
                            },
                            {
                                "name": "pant",
                                "isPacked": false
                            }
                        ],
                        "footwears": [
                            {
                                "name": "sandals",
                                "isPacked": false
                            },
                            {
                                "name": "shoes",
                                "isPacked": false
                            }
                        ],
                        "weather_based": [
                            {
                                "name": "rain coat",
                                "isPacked": false
                            }
                        ]
                    }
                }
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


module.exports = { insertTrip }