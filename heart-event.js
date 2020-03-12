module.exports = function initHeartEvent(RED) {
  function HeartEvent(config) {
    RED.nodes.createNode(this, config)
    this.heartConfig = RED.nodes.getNode(config.heart)
    const heart = this.heartConfig.getHeart()

    if (heart) {
      const handleEvent = event => {
        RED.log.info(event.property)
        if (event.functionId !== config.func && config.func !== '_ALL_') { return }
        this.send({ payload: event.property })
      }
      this.on('close', _ => heart.events.unsubscribe(handleEvent))
      heart.events.subscribe(handleEvent)
    }
  }

  RED.nodes.registerType('heart-event', HeartEvent)
}

