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
        EXISTING_TRIP: "_EXISTING_TRIP",
        CATEGORY_SELECT: "_CATEGORY_SELECT"
    },

    packingStatus: {
        NOT_STARTED: "_NOT_STARTED",
        STARTED: "_STARTED",
        IN_PROGRESS: "_IN_PROGRESS",
        COMPLETED: "_COMPLETED"
    },

    packingItemStatus: {
        PACKED: "_PACKED",
        NOT_PACKED: "_NOT_PACKED",
        NOT_INTERESTED: "_NOT_INTERESTED",
        REMIND_LATER: "_REMIND_LATER"
    },

    session: {
        CURRENT_TRIP: "_CURRENT_TRIP",
        CURRENT_PACKING_LIST: "_CURRENT_PACKING_LIST",
        CURRENT_PACKING_ITEM: "_CURRENT_PACKING_ITEM",
        CURRENT_PACKING_ITEM_KEY: "_CURRENT_PACKING_ITEM_KEY",
        CURRENT_PACKING_CATEGORY_KEY: "_CURRENT_PACKING_CATEGORY_KEY",
        CURRENT_TOTAL_PACKING_STATUS: "_CURRENT_TOTAL_PACKING_STATUS",
        CURRENT_CATEGORY_PACKING_STATUS: "_CURRENT_CATEGORY_PACKING_STATUS",
        PROMPT_QUEUE: "_PROMPT_QUEUE",
        USER_INFO: "_USERINFO"
    },

    intents: {
        NewSession: "NewSession",

        IncompleteTripIntent: "IncompleteTripIntent",
        StartNewPackingIntent: "StartNewPackingIntent",
        ResumeOldPackingIntent: "ResumeOldPackingIntent",

        NewTripIntent: "NewTripIntent",

        PackItemIntent: "PackItemIntent",
        PackNewCategoryIntent: "PackNewCategoryIntent",
        PackingCompleteIntent: "PackingCompleteIntent",
        RemindLaterIntent: "RemindLaterIntent",

        ListInvokeIntent: "ListInvokeIntent",
        ListCategoryIntent: "ListCategoryIntent",
        SelectCategoryIntent: "SelectCategoryIntent",
        StartSelectedCategoryIntent: "StartSelectedCategoryIntent",

        WaitIntent: "WaitIntent",

        AMAZON: {
            YesIntent: "AMAZON.YesIntent",
            NoIntent: "AMAZON.NoIntent",
            HelpIntent: "AMAZON.HelpIntent",
            StopIntent: "AMAZON.StopIntent",
        },

        Unhandled: "Unhandled",
        SessionEndedRequest: "SessionEndedRequest"
    }

});