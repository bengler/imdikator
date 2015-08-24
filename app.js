import express from 'express'
import path from 'path'
import config from './config'
import helmet from 'helmet'
import staticRoutes from './static-routes'
import quickreload from 'quickreload'
import capture from 'error-capture-middleware'

const app = express()
app.disable('x-powered-by')

app.use(helmet.nosniff())
app.use(helmet.xframe('sameorigin'))
app.use(helmet.xssFilter())
app.use(helmet.ienoopen())

app.set('query parser', 'extended')

if (config.env === 'development') {
  app.use(quickreload())
}

if (config.env === 'development') {
  const serve = require('staticr/serve')
  app.use(serve(staticRoutes))
}

if (config.env === 'development') {
  app.use(capture.js())
  app.use(capture.css())
}

app.get('/', function (req, res) {
  res.status(200).send('OK')
})

app.use(express.static(path.join(__dirname, 'public')))

export default app
