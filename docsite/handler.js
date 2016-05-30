import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/Layout'

export default function handleRequest(req, res) {
  res.status(200).send(ReactDOM.renderToStaticMarkup(<Layout />))
}
