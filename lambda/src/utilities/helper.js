function clearState() {
    this.handler.state = '' // delete this.handler.state might cause reference errors
    delete this.attributes['STATE'];
}

module.exports = { clearState }