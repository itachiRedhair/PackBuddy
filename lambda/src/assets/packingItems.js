"use strict";
var packingItemsFixed = {
    toiletries: {
        'deodorant': {
            'name': 'deodorant',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'flosss': {
            'name': 'flosss',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'hairbrush': {
            'name': 'hairbrush',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'toothbrush': {
            'name': 'toothbrush',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'toothpaste': {
            'name': 'toothpaste',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        }
    },
    clothing: {
        'shirt': {
            'name': 'toothpaste',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'jeans': {
            'name': 'toothpaste',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'regular_clothes': {
            'name': 'toothpaste',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        }
    },
    electronics: {
        'phone_charger': {
            'name': 'phone_charger',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'phone': {
            'name': 'phone',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'laptop': {
            'name': 'laptop',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        },
        'power_bank': {
            'name': 'power_bank',
            'status': 'not_packed',
            'meta_info': {},
            'packed_on': '',
            'preferred_baggage': 'cabin'
        }
    }
}

var packingItemWeather = {
    cold: {
        'clothing': {
            'sweater': {
                'name': 'sweater',
                'status': 'not_packed',
                'meta_info': {},
                'packed_on': '',
                'preferred_baggage': 'cabin'
            },
            'blanket': {
                'name': 'blanket',
                'status': 'not_packed',
                'meta_info': {},
                'packed_on': '',
                'preferred_baggage': 'cabin'
            },
            'jacket': {
                'name': 'jacket',
                'status': 'not_packed',
                'meta_info': {},
                'packed_on': '',
                'preferred_baggage': 'cabin'
            }
        }
    },
    hot: {
        'clothing': {
            'umbrella': {
                'name': 'umbrella',
                'status': 'not_packed',
                'meta_info': {},
                'packed_on': '',
                'preferred_baggage': 'cabin'
            },
            'sleeveless_clothes': {
                'name': 'sleeveless_clothes',
                'status': 'not_packed',
                'meta_info': {},
                'packed_on': '',
                'preferred_baggage': 'cabin'
            }
        }

    },
    rainy: {
        'clothing': {
            'rain_coat': {
                'name': 'rain_coat',
                'status': 'not_packed',
                'meta_info': {},
                'packed_on': '',
                'preferred_baggage': 'cabin'
            },
            'umbrella': {
                'name': 'umbrella',
                'status': 'not_packed',
                'meta_info': {},
                'packed_on': '',
                'preferred_baggage': 'cabin'
            }
        }

    }
}
module.exports = { packingItemsFixed, packingItemWeather };