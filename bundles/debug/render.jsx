import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import RenderTestContent from '../../components/testbed/RenderTestContent'
import domready from 'domready'

function bootstrap() {
  const container = document.getElementById('content')
  ReactDOM.render(<RenderTestContent />, container)
}

domready(bootstrap)
