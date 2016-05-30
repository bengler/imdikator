import React, {Component} from 'react'
import DefaultLayout from './DefaultLayout'

class RenderTestPage extends Component {
  render() {

    const extraHead = [
      <script key="embeds-debug" src="/build/js/embeds-debug.js" async defer />,
      <script
        key="imdikator-loader"
        id="imdikator-loader"
        data-api-host="imdikator-st.azurewebsites.net"
        data-content-api-host="www.imdi.no"
        src="/build/js/loader.js" async defer
      />,
      <link key="codemirror" rel="stylesheet" href="/build/stylesheets/codemirror.css" />,
      (<style key="codemirror-extra" type="text/css" dangerouslySetInnerHTML={{__html: `
        .CodeMirror {
          font-size: 0.8em;
          height: auto;
          border: 1px solid #eee;
        }
        .CodeMirror-scroll {
          height: auto;
        }`}} />)
    ]

    return (
      <DefaultLayout extraHead={extraHead}>
        <div id="content" />
      </DefaultLayout>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
