"use strict";

module.exports = Object.freeze({

    appId: "amzn1.ask.skill.d8ab4426-66ca-4dfd-bd0d-7f2c02419413",

    dynamoDBTableName: 'packBuddyTable',

    states: {
        LAUNCH: "_LAUNCH",
        NEW_TRIP: "_NEW_TRIP",
        PACKING: "_PACKING",
        EXISTING_TRIP: "_EXISTING_TRIP"
    }
});