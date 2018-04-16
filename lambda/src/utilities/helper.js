'use strict';

const fetch = require("node-fetch");

function clearState() {
    this.handler.state = '' // delete this.handler.state might cause reference errors
    delete this.attributes['STATE'];
}

function getUserInfoFromFB() {
    let url = "https://graph.facebook.com/me?fields=first_name,last_name,gender,age_range,locale&access_token="
    let accessToken = this.event.session.user.accessToken;

    return new Promise((resolve, reject) => {
        if (!accessToken) {
            resolve(null);
        } else {
            fetch(url + accessToken)
                .then(res => res.json())
                .then(body => {
                    console.log(body);
                    if (body) {
                        resolve(body)
                    } else {
                        resolve(null)
                    }
                }).catch(err => {
                    console.log('error while fetching userInfo from facebook', err);
                    reject(err);
                });
        }
    })
}

module.exports = { clearState, getUserInfoFromFB }