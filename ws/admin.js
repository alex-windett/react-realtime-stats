const http = require('http')
const app = require('../server.js').app
const server = http.Server(app)
const WebSocketServer = require('ws').Server

let wsAdminConnected = () => {
  socket.send(JSON.stringify(users))
}

module.exports = wsAdminConnected
