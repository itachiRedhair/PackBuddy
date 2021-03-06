"use strict";
var packingItemsFixed = {
    toiletries: {
        name: 'toiletries',
        items: {
            'deodorant': {
                'name': 'deodorant',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'flosss': {
                'name': 'flosss',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'hairbrush': {
                'name': 'hairbrush',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'toothbrush': {
                'name': 'toothbrush',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'toothpaste': {
                'name': 'toothpaste',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            }
        },
        all_packed: false,
        remind_later: false
    },
    clothing: {
        name: 'clothing',
        items: {
            'shirt': {
                'name': 'shirt',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'jeans': {
                'name': 'jeans',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'regular clothes': {
                'name': 'regular clothes',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            }
        },
        all_packed: false,
        remind_later: false
    },
    electronics: {
        name: "electronics",
        items: {
            'phone charger': {
                'name': 'phone charger',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'phone': {
                'name': 'phone',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'laptop': {
                'name': 'laptop',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            },
            'power bank': {
                'name': 'power bank',
                'status': '_NOT_PACKED',
                'meta_info': {},
                'packed_on': 'null',
                'preferred_baggage': 'cabin'
            }
        },
        all_packed: false,
        remind_later: false
    }
}

const packingItemWeather = {
    cold: {
        'clothing': {
            items: {
                'sweater': {
                    'name': 'sweater',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                },
                'blanket': {
                    'name': 'blanket',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                },
                'jacket': {
                    'name': 'jacket',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                }
            }
        }
    },
    hot: {
        clothing: {
            'items': {
                'umbrella': {
                    'name': 'umbrella',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                },
                'sleeveless clothes': {
                    'name': 'sleeveless clothes',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                }
            }
        }
    },
    rainy: {
        clothing: {
            'items': {
                'rain_coat': {
                    'name': 'rain coat',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                },
                'umbrella': {
                    'name': 'umbrella',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                }
            }
        }
    }
}

const packingItemGender = {
    male: {
        'toiletries': {
            items: {
                'shaving_cream': {
                    'name': 'shaving cream',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                },
                'mens_perfume': {
                    'name': "men's perfume",
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                }
            }
        }
    },
    female: {
        'toiletries': {
            items: {
                'makeup_box': {
                    'name': 'makeup box',
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                },
                'womens_perfume': {
                    'name': "women's perfume",
                    'status': '_NOT_PACKED',
                    'meta_info': {},
                    'packed_on': 'null',
                    'preferred_baggage': 'cabin'
                }
            }
        }
    }
}
module.exports = { packingItemsFixed, packingItemWeather, packingItemGender };