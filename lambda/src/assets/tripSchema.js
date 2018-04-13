"use strict";
var trip = {
    trip_id: '',
    trip_info: {
        trip_name: '',
        from_city: '',
        to_city: '',
        date: '',
        purpose: '',
        duration: ''
    },
    packing_list: {},
    packing_status: '_NOT_STARTED',
    last_packed: {
        item_name: '',
        category: ''
    },
    // total_item_count: 0,
    // packed_item_count: 0,
    remind_me: false
}
module.exports = trip;