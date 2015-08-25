import express from 'express'
import path from 'path'
import React from 'react'
import Layout from './components/layouts/DefaultLayout'
import staticRoutes from './static-routes'
import quickreload from 'quickreload'
import capture from 'error-capture-middleware'

const app = express()

app.use(quickreload())
const serve = require('staticr/serve')
app.use('/build', serve(staticRoutes))

app.use(capture.js())
app.use(capture.css())

app.get('/*', function (req, res) {
  res.status(200).send(React.renderToStaticMarkup(<Layout/>))
})

app.use(express.static(path.join(__dirname, 'public')))

export default app
