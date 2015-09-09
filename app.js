import express from 'express'
import path from 'path'
import React from 'react'
import Layout from './components/layouts/DefaultLayout'
import staticRoutes from './static-routes'
import fonts from './static-routes/fonts'
import quickreload from 'quickreload'
import capture from 'error-capture-middleware'
import docsite from './docsite/handler'

const app = express()

app.use(quickreload())
const serve = require('staticr/serve')
app.use('/build', serve(staticRoutes))
app.use('/UI', serve(fonts))

app.use(capture.js())
app.use(capture.css())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/docs*', docsite)

app.get('/*', function (req, res) {
  res.status(200).send(React.renderToStaticMarkup(<Layout/>))
})

export default app
