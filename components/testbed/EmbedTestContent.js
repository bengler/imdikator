import React, {Component} from 'react'
import {API_GLOBAL} from '../../bundles/common'

import Highlight from 'react-highlight'

const DEFAULT_URL = '/indikator/steder/K0912/arbeid/sysselsatte-innvandrere-landbakgrunn/latest'

function indent(spaces) {
  return str => {
    return str.split('\n').map((line, i) => {
      if (i === 0) {
        return line
      }
      return ' '.repeat(spaces) + line
    }).join('\n')
  }
}

class RenderTestPage extends Component {

  constructor(props) {
    super()
    this.state = {
      editValue: DEFAULT_URL,
      exampleUrl: DEFAULT_URL
    }
  }

  componentDidMount() {
    if (window[API_GLOBAL]) {
      window[API_GLOBAL].scan()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.exampleUrl !== prevState.exampleUrl) {
      const imdikator = window[API_GLOBAL]
      imdikator.reload()
    }
  }

  commit(e) {
    e.preventDefault()
    this.setState({exampleUrl: this.state.editValue})
  }

  makeEmbedConfig(url) {
    return JSON.stringify({
      version: 1,
      url: url
    }, null, 2)
  }

  renderScriptTag() {
    return `<script
  id="imdikator-loader"
  data-api-host="imdikator-st.azurewebsites.net"
  src="http://imdikator.staging.o5.no/build/js/loader.js"
  async
  defer
/>`
  }

  renderEmbed(url) {
    return `<div data-imdikator="embed">
  <script type="application/json">
    ${indent(4)(this.makeEmbedConfig(url))}
  </script>
  Henter figur…
</div>
`
  }

  render() {

    const {exampleUrl, editValue} = this.state

    const changed = exampleUrl !== editValue

    const editExample = event => {
      this.setState({editValue: event.target.value})
    }

    return (
      <div className="wrapper">
        <h2>Imdi indikator embeds debugger</h2>
        <div className="row">
          <h2>Script tag</h2>
          <p>Place this as high up as possible in the document, preferably immediately after {'<head>'}</p>
          <Highlight className="html">
            {this.renderScriptTag()}
          </Highlight>
        </div>
        <br/>
        <div className="row">
          <h2>Embed code</h2>
          <p>Place this where the chart should appear</p>
          <Highlight className="html">
            {this.renderEmbed(editValue)}
          </Highlight>
          <br/>
          <form onSubmit={this.commit.bind(this)}>
            <div style={{display: 'flex', flex: 1}}>
              <div style={{flex: 0.8}}>
                <input type="text" onChange={editExample} value={editValue}/>
              </div>
              <div style={{flex: 0.2}}>
                <button className="button" type="submit" disabled={!changed} style={{margin: 0}}>
                  Try another URL…
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="row">
          <h2>Rendered chart</h2>
          <div className="col--main">
            <div dangerouslySetInnerHTML={{__html: this.renderEmbed(exampleUrl)}}/>
          </div>
        </div>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
