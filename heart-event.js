module.exports = function initHeartEvent(RED) {
  function HeartEvent(config) {
    RED.nodes.createNode(this, config)
    this.heartConfig = RED.nodes.getNode(config.heart)
  }

 
  RED.nodes.registerType('heart-event', HeartEvent)
}

