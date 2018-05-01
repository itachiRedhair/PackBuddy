"use strict";
var packingItemsFixed = {
  toiletries: {
    name: "toiletries",
    items: {
      deodorant: {
        name: "deodorant",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      },
      flosss: {
        name: "flosss",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      },
      hairbrush: {
        name: "hairbrush",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      },
      toothbrush: {
        name: "toothbrush",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      },
      toothpaste: {
        name: "toothpaste",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      }
    },
    all_packed: false,
    remind_later: false
  },
  clothing: {
    name: "clothing",
    items: {
      shirt: {
        name: "shirt",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      },
      jeans: {
        name: "jeans",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      },
      "regular clothes": {
        name: "regular clothes",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: ""
      }
    },
    all_packed: false,
    remind_later: false
  },
  electronics: {
    name: "electronics",
    items: {
      "phone charger": {
        name: "phone charger",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "hand baggage"
      },
      phone: {
        name: "phone",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "hand baggage"
      },
      laptop: {
        name: "laptop",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "hand baggage"
      },
      "power bank": {
        name: "power bank",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "hand baggage"
      }
    },
    all_packed: false,
    remind_later: false
  }
};

const packingItemWeather = {
  cold: {
    clothing: {
      items: {
        sweater: {
          name: "sweater",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        },
        blanket: {
          name: "blanket",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        },
        jacket: {
          name: "jacket",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        }
      }
    }
  },
  hot: {
    clothing: {
      items: {
        umbrella: {
          name: "umbrella",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        },
        "sleeveless clothes": {
          name: "sleeveless clothes",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        }
      }
    }
  },
  rainy: {
    clothing: {
      items: {
        rain_coat: {
          name: "rain coat",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        },
        umbrella: {
          name: "umbrella",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        }
      }
    }
  }
};

const packingItemGender = {
  male: {
    toiletries: {
      items: {
        shaving_cream: {
          name: "shaving cream",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        },
        mens_perfume: {
          name: "men's perfume",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        }
      }
    }
  },
  female: {
    toiletries: {
      items: {
        makeup_box: {
          name: "makeup box",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        },
        womens_perfume: {
          name: "women's perfume",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: ""
        }
      }
    }
  }
};
module.exports = { packingItemsFixed, packingItemWeather, packingItemGender };
