"use strict";

module.exports = Object.freeze({

    appId: "amzn1.ask.skill.d8ab4426-66ca-4dfd-bd0d-7f2c02419413",

    //dynamodb tables
    sessionTable: 'sessionTable',
    tripDataTable: 'tripDataTable',

    states: {
        LAUNCH: "_LAUNCH",
        NEW_TRIP: "_NEW_TRIP",
        PACKING: "_PACKING",
        EXISTING_TRIP: "_EXISTING_TRIP"
    },

    packingStatus: {
        STARTED: "_STARTED",
        IN_PROGRESS: "_IN_PROGRESS",
        COMPLETED: "_COMPLETED"
    }
});