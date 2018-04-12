'use strict';

let AWS = require('aws-sdk');
let constants = require('./../constants.js');
let session = require('./../constants.js').session;

//setting environment variable
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    AWS.config.update({
        "apiVersion": "2012-08-10",
        "accessKeyId": "abcde",
        "secretAccessKey": "abcde",
        "region": "us-east-1",
        "endpoint": "http://localhost:3333"
    });
}

var dynamodb = new AWS.DynamoDB();

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
        console.log('here in ddb insert trip with userId', userId)
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

        initializeDynamoDB(userId).then(() => {
            console.log('here in initializedynamodb in insert trip');
            documentClient.update(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }).catch(err => {
            reject(err);
            console.log('error in initializeDynamoDB');
        });
    });
}

function updatePackingList() {
    let userId = this.event.session.user.userId;
    let tripId = this.attributes[session.CURRENT_TRIP];
    let packingList = this.attributes[session.CURRENT_PACKING_LIST];
    console.log('inisde ddb update packing list', userId, tripId);
    return new Promise((resolve, reject) => {
        // console.log('here in dynamodb with userId ', userId)
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            UpdateExpression: "SET trip_list.#ti.packing_list = :pl",
            ExpressionAttributeValues: {
                ":pl": packingList
            },
            ExpressionAttributeNames: {
                "#ti": tripId
            }
        };

        // initializeDynamoDB(userId).then(() => {
        documentClient.update(params, (err, data) => {
            if (err) {
                console.log("Error while updating dynamodb in updatePackingList(), err=>", err);
                reject(err);
            } else {
                // console.log(data); // successful response
                resolve();
            }
        });
        // })
    });
}

function initializeDynamoDB(userId) {
    return new Promise((resolve, reject) => {
        // console.log('here in ddb initializeDynamoDB with userId', userId)
        //TODO: refactor following code
        // listTables().then(data => {
        //     const exists = data.TableNames
        //         .filter(name => {
        //             return name === constants.tripDataTable;
        //         })
        //         .length > 0;

        //     // console.log(exists);
        //     if (!exists) {
        //TODO: remove following code later
        //following code is redundant

        // createTable().then(() => {
        //     waitForTableReady().then(() => {
        //         initializeTableData(userId).then(() => {
        //             resolve();
        //             console.log('table data initialized successfully');
        //         }).catch(err => {
        //             console.log('error in table data initialization');
        //             reject(err);
        //         })
        //     }).catch(err => {
        //         console.log('error in wait for table ready');
        //         reject(err);
        //     })
        // }).catch(err => {
        //     console.log('error in table creartion');
        //     reject(err);
        // })
        // } else {
        checkIfTableDataExist(userId).then(data => {
            console.log('in checkIf table data exist call, data=>', data, JSON.stringify(data), Object.keys(data).length);
            if (Object.keys(data.Item).length < 2) {
                initializeTableData(userId).then(data => {
                    console.log('table data initialized successfully');
                    resolve();
                })
            }
            resolve();
        }).catch(err => {
            console.log("error in check if table data exists");
            reject(err);
        })
        // }
        // }).catch(err => {
        //     console.log('error in listing table');
        //     reject(err);
        // })
    })
}

function listTables() {
    return new Promise((resolve, reject) => {
        console.log('here in ddb listTables with userId')
        dynamodb.listTables({}, (err, data) => {
            if (err) reject(err);
            else {
                console.log('table list data', data);
                resolve(data);
            }
        });
    })
}

function createTable() {
    return new Promise((resolve, reject) => {
        console.log('here in ddb create Table')
        let params = {
            TableName: constants.tripDataTable,
            KeySchema: [
                {
                    AttributeName: 'userId',
                    KeyType: 'HASH',
                }
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'userId',
                    AttributeType: 'S'
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            }
        };

        dynamodb.createTable(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else {
                resolve();
            }
        });
    })
}

function waitForTableReady() {
    return new Promise((resolve, reject) => {
        console.log('here in ddb wait for table ready');
        var params = {
            TableName: constants.tripDataTable
        };

        dynamodb.waitFor('tableExists', params, function (err, data) {
            if (err) reject(err) // an error occurred
            else {
                resolve();
            };
        });
    })
}

function initializeTableData(userId) {
    return new Promise((resolve, reject) => {
        console.log('here in ddb initialize table data');
        let params = {
            TableName: constants.tripDataTable,
            Item: {
                userId: userId,
                last_trip_key: "null",
                trip_list: {}
            }
        };
        documentClient.put(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(); // successful response
        });
    });
}

function checkIfTableDataExist(userId) {
    return new Promise((resolve, reject) => {
        console.log('here in ddb checkIf table data exist');
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            AttributesToGet: [
                'trip_list',
                'last_trip_key'
            ]
        };
        documentClient.get(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    })
}

module.exports = { insertTrip, getFromDDB, updatePackingList, getLastTripID }
