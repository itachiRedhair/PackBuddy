
var name = '';

var handlers = {
    'SayHello': function () {
        name = this.attributes['name'] ? this.attributes['name'] : '';
        this.response.speak(this.t("WELCOME_MSG") + name + ' man')
            .cardRenderer(this.t("WELCOME_MSG"), this.t("WELCOME_MSG")).listen();
        this.emit(':responseReady');
    },
    'SayHelloName': function () {
        if (this.event.request.intent.slots.name.value == undefined || this.event.request.intent.slots.name.value == '') {
            name = this.attributes['name'];
        } else {
            name = this.event.request.intent.slots.name.value;
            this.attributes['name'] = name;
        }
        this.response.speak(this.t("WELCOME_MSG") + '' + name)
            .cardRenderer(this.t("WELCOME_MSG"), this.t("WELCOME_MSG") + name).listen();
        this.emit(':responseReady');
    }
}

module.exports = handlers;