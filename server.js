const http = require('http')
const express = require('express')
const WebSocketServer = require('ws').Server
const geoip = require('geoip-lite')
const useragent = require('useragent')
const webpack = require('webpack')
const exphbs  = require('express-handlebars');
const path = require('path');

const webpackConfig = require('./webpack.config.js')
const wsConnected = require('./ws')
const wsAdminConnected = require('./ws/admin.js')

const app = express();
const isProd = process.env.NODE_ENV === 'production'
const server = http.Server(app)

const config = {
  port: 8080,
  wshost: 'ws://localhost:8080',
  webpack: webpackConfig
}

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const compiler = webpack(config.webpack)

app.use(express.static('static'))
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views')); 

if (!isProd) {
  app.use(webpackHotMiddleware(compiler))
}

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.webpack.output.publicPath,
  noInfo: true
}))

let users = {}
let userCount = 0
let userLastID = 0
let user = {}

let wssadmin = new WebSocketServer({
  server,
  path: '/dashboard'
})

wssadmin.on('connection', socket => wsAdminConnected() )
setInterval(() => wssadmin.clients.forEach(s => s.send(JSON.stringify(users))), 1000)

let wss = new WebSocketServer({
  server,
  path: '/',
  clientTracking: false,
  maxPayload: 1024
})

wss.on('connection', socket => wsConnected() )
wss.on('error', err => console.error(err))
setInterval( () => console.log(`Users Online: ${userCount}`, 10 * 100) )

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/analytics.js', (req, res) => {
  let trackerjs = `
  var socket = new WebSocket('${config.wshost}');
  socket.onopen = function() {
    socket.send(JSON.stringify({
      type: 'init',
      url: document.location.href,
      ref: document.referrer
    }));
  };`

  res.set('Content-Type', 'application/javascript')
  res.send(trackerjs)
})

app.get('/test/:id', (req, res) => {
  res.render('/test.html', {
    id: req.params.id
  })
})

app.disable('x-powered-by')
console.log(`>>>>> Started on port ${config.port} >>>>>>>`)
server.listen(config.port)

module.exports = {
  config,
  app,
  server
}
