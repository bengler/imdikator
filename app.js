import express from 'express'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import SiteTest from './components/testbed/SiteTest'
import EmbedTest from './components/testbed/EmbedTest'
import RenderTest from './components/testbed/RenderTest'
import config from './config'
import staticRoutes from './static-routes'
import quickreload from 'quickreload'
import capture from 'error-capture-middleware'
import serve from 'staticr/serve'
import proxy from 'html2canvas-proxy'

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

app.use('/', proxy())

app.get('/debug/embeds', (req, res) => {
  res.status(200).send(ReactDOMServer.renderToStaticMarkup(<EmbedTest />))
})

app.get('/debug/render', (req, res) => {
  res.status(200).send(ReactDOMServer.renderToStaticMarkup(<RenderTest />))
})

app.get('/', (req, res) => {
  res.redirect('/tall-og-statistikk')
})

app.get('/tall-og-statistikk*', (req, res) => {
  res.status(200).send(ReactDOMServer.renderToStaticMarkup(<SiteTest />))
})

if (config.env === 'development') {
  app.use(require('dev-error-handler')) // eslint-disable-line import/no-commonjs
}

export default app
