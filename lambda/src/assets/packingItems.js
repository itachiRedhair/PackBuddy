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
        preferred_baggage: "null"
      },
      flosss: {
        name: "flosss",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "null"
      },
      hairbrush: {
        name: "hairbrush",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "null"
      },
      toothbrush: {
        name: "toothbrush",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "null"
      },
      toothpaste: {
        name: "toothpaste",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "null"
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
        preferred_baggage: "null"
      },
      jeans: {
        name: "jeans",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "null"
      },
      "regular clothes": {
        name: "regular clothes",
        status: "_NOT_PACKED",
        meta_info: {},
        packed_on: "null",
        preferred_baggage: "null"
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
          preferred_baggage: "null"
        },
        blanket: {
          name: "blanket",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: "null"
        },
        jacket: {
          name: "jacket",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: "null"
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
          preferred_baggage: "null"
        },
        "sleeveless clothes": {
          name: "sleeveless clothes",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: "null"
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
          preferred_baggage: "null"
        },
        umbrella: {
          name: "umbrella",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: "null"
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
          preferred_baggage: "null"
        },
        mens_perfume: {
          name: "men's perfume",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: "null"
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
          preferred_baggage: "null"
        },
        womens_perfume: {
          name: "women's perfume",
          status: "_NOT_PACKED",
          meta_info: {},
          packed_on: "null",
          preferred_baggage: "null"
        }
      }
    }
  }
};
module.exports = { packingItemsFixed, packingItemWeather, packingItemGender };
