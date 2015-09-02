import React from 'react'
import Layout from './components/Layout'

export default function handleRequest(req, res) {
  res.status(200).send(React.renderToStaticMarkup(<Layout/>))
}
