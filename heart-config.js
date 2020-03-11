const AnimusHeart = require('jons-animusheart')

module.exports = function(RED) {
  const hearts = {}


  function createOrGetHeart(id) {
    if (!hearts[id]) {
      const node = RED.nodes.getNode(id)
      hearts[id] = new AnimusHeart(node.host, node.apikey, { logger: RED.log })
    }
    return hearts[id]
  }

  RED.httpAdmin.get(
    '/animusheart/:id/devices',
    RED.auth.needsPermission('animusheart-device.read'),
    async function(req, res) {
      const id = req.params.id
      const heart = createOrGetHeart(id)
      if (!heart) {
        return res.status(404).end()
      }
      const devices = await heart.devices
      res.status(200).json(devices)
    })

  RED.httpAdmin.get(
    '/animusheart/:id/devices/:did/functions',
    RED.auth.needsPermission('animusheart-device.read'),
    async function(req, res) {
      const id = req.params.id
      const heart = createOrGetHeart(id)
      if (!heart) {
        return res.status(404).end('No such Heart')
      }
      const devices = await heart.devices
      const device = devices[req.params.did]
      if (!device) {
        return res.status(404).end('No such device')
      }
      const functions = await device.functions
      res.status(200).json(functions)
    })

  function HeartConfig(config) {
    RED.nodes.createNode(this, config)
    this.host = config.host
    this.apikey = config.apikey
  }

  HeartConfig.prototype.getHeart = function() {
    return createOrGetHeart(this.id)
  }

  RED.nodes.registerType('heart-config', HeartConfig)
}
