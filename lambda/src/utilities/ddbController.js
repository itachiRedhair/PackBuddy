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

        initializeDynamoDB(userId).then(data => {
            documentClient.update(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
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

        initializeDynamoDB(userId).then(data => {
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
        })
    });
}

function initializeDynamoDB(userId) {
    return new Promise((resolve, reject) => {
        listTables().then(data => {
            const exists = data.TableNames
                .filter(name => {
                    return name === constants.tripDataTable;
                })
                .length > 0;

            // console.log(exists);
            if (!exists) {
                createTable().then(data => {
                    waitForTableReady().then(data => {
                        initializeTableData(userId).then(data => {
                            resolve(data);
                            console.log('table data initialized successfully');
                        }).catch(err => {
                            console.log('error in table data initialization');
                        })
                    }).catch(err => {
                        console.log('error in wait for table ready');
                    })
                }).catch(err => {
                    console.log('error in table creartion');
                })
            } else {
                checkIfTableDataExist(userId).then(data => {
                    if (data === undefined || data === null) {
                        initializeTableData(userId).then(data => {
                            resolve(data);
                            console.log('table data initialized successfully');
                        })
                    }
                })
            }

        }).catch(err => {
            console.log('error in listing table');
        })
    })
}

function listTables() {
    return new Promise((resolve, reject) => {
        dynamodb.listTables({}, (err, data) => {
            if (err) reject(err);
            else {
                resolve(data);
            }
        });
    })
}

function createTable() {
    return new Promise((resolve, reject) => {
        var params = {
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
                resolve(data);
            }
        });
    })
}

function waitForTableReady() {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'tripDataTable'
        };

        dynamodb.waitFor('tableExists', params, function (err, data) {
            if (err) reject(err) // an error occurred
            else {
                resolve(data)
            };
        });
    })
}

function initializeTableData(userId) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'tripDataTable',
            Item: {
                userId: userId,
                last_trip_key: "null",
                trip_list: {}
            }
        };
        docClient.put(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    });
}

function checkIfTableDataExist(userId) {
    return Promise((resolve, reject) => {
        var params = {
            TableName: constants.tripDataTable,
            Key: {
                userId: userId
            },
            AttributesToGet: [
                'userId'
            ],
        };
        docClient.get(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    })
}

module.exports = { insertTrip, getFromDDB, updatePackingList, getLastTripID }
