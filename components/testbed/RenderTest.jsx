import React, {Component} from 'react'
import DefaultLayout from './DefaultLayout'

class RenderTestPage extends Component {
  render() {

    const extraHead = [
      <script src="/build/js/render-debug.js" async defer/>
    ]

    return (
      <DefaultLayout extraHead={extraHead}>
        <div id="content"/>
      </DefaultLayout>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
