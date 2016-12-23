const http = require('http')
const app = require('../server.js').app
const server = http.Server(app)
const WebSocketServer = require('ws').Server

const wsConnected = () => {
  userCount++

  let id = userLastID++
  let ip = socket.upgradeReq.headers['x-real-ip'] || socket.upgradeReq.connection.remoteAddress
  user = users[id] = {
    id,
    ip,
    host: socket.upgradeReq.headers['host'],
    ipgeo: geoip.lookup(ip),
    ua: useragent.lookup(socket.upgradeReq.headers['user-agent']).toJSON(),
    date: Date.now(),
    updated: Date.now()
  }

  socket.on('message', msg => {
    try {
      msg = JSON.parse(msg)
    } catch (e) {
      return
    }

    switch (msg.type) {
      case 'init':
      user.url = msg.url
      user.ref = msg.ref
      break
    }

    user.updated = Date.now()
  })

  socket.once('close', () => {
    delete users[id]
    userCount--
  })
}

module.export = wsConnected
