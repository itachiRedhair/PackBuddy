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
    packing_status: 'not_started',
    last_packed: {
        item_name: '',
        category: ''
    },
    total_item_count: 0,
    packed_item_count: 0
}
module.exports = trip;