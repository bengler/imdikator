import express from 'express'
import path from 'path'
import React from 'react'
import Layout from './components/layouts/DefaultLayout'
import config from './config'
import staticRoutes from './static-routes'
import fonts from './static-routes/fonts'
import quickreload from 'quickreload'
import capture from 'error-capture-middleware'
import docsite from './docsite/handler'

const app = express()


if (config.env === 'development') {
  app.use(quickreload())
}

if (config.env === 'development') {
  const serve = require('staticr/serve')
  app.use('/build', serve(staticRoutes))
  app.use('/UI', serve(fonts))
}

if (config.env === 'development') {
  app.use(capture.js())
  app.use(capture.css())
}

app.get('/', function (req, res) {
  res.status(200).send(React.renderToStaticMarkup(<Layout/>))
})
if (config.env === 'development') {
  app.use(express.static(path.join(__dirname, 'public')))
}

if (config.env === 'development') {
  app.get('/docs*', docsite)
}

app.get('/*', function (req, res) {
  res.status(200).send(React.renderToStaticMarkup(<Layout/>))
})

export default app
