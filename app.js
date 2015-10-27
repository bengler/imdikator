import express from 'express'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Layout from './components/layouts/DefaultLayout'
import config from './config'
import staticRoutes from './static-routes'
import quickreload from 'quickreload'
import capture from 'error-capture-middleware'
import docsite from './docsite/handler'
import devErrorHandler from 'dev-error-handler'
import serve from 'staticr/serve'

const app = express()


if (config.env === 'development') {
  app.use(quickreload())
}

if (config.env === 'development') {
  app.use(serve(staticRoutes))
}

if (config.env === 'development') {
  app.use(capture.js())
  app.use(capture.css())
}

if (config.env === 'development') {
  app.use(express.static(path.join(__dirname, 'public')))
}

if (config.env === 'development') {
  app.get('/docs*', docsite)
}

app.get('/*', (req, res) => {
  res.status(200).send(ReactDOMServer.renderToStaticMarkup(<Layout/>))
})

app.use(devErrorHandler)

export default app
