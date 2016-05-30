import React from 'react'
import ReactDOM from 'react-dom'
import EmbedTestContent from '../../components/testbed/EmbedTestContent'
import domready from 'domready'

function bootstrap() {
  const container = document.getElementById('content')
  ReactDOM.render(<EmbedTestContent />, container)
}

domready(bootstrap)
