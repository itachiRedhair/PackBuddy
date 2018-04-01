const respondToNewTripIntent = require('../responses/new-trip.response');
module.exports = {
    'NewTripIntent': function () {
        if (this.event.request.dialogState !== 'COMPLETED') {
            this.emit(':delegate');
        } else {
            this.emit(':tell', respondToNewTripIntent());
        }
    },
};
