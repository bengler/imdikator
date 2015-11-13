import React, {Component} from 'react'
import DefaultLayout from './DefaultLayout'

class RenderTestPage extends Component {
  render() {

    const extraHead = [
      <script src="/build/js/embeds-debug.js" async defer/>,
      <script id="imdikator-loader" data-api-host="imdikator-st.azurewebsites.net" src="/build/js/loader.js" async defer/>,
      <link rel="stylesheet" href="/build/stylesheets/highlight.css"/>,
      (<style type="text/css" dangerouslySetInnerHTML={{__html: `
        .hljs {
          font-size: 0.8em;
          white-space: pre;
          word-wrap: normal;
        }
      `}}>
      </style>)
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
