import React, {Component} from 'react'
import {API_GLOBAL} from '../../bundles/constants'

import CodeMirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'

const DEFAULT_URL = '/tall-og-statistikk/steder/K1235/befolkning/befolkning_hovedgruppe/sammenliknet'

//const OTHER_EXAMPLES = [
//  {
//    title: 'Sysselsetting etter innvandringsgrunn, sammenlignet',
//    url: '/tall-og-statistikk/steder/K0301/arbeid/sysselsetting-etter-innvandringsgrunn/enkeltaar/'
//    + '@$cmp:K0104,K0231,K1103;$u:prosent;$y:2013;innvgrunn5:arbeid,familie,flukt,annet_uoppgitt;kjonn:0'
//  },
//
//  {
//    title: 'Befolkning verdensregion, åttedelt, sammenlignet',
//    url: '/tall-og-statistikk/steder/K1235/befolkning/befolkning_verdensregion_aattedelt/enkeltaar/@$u:personer;'
//    + '$y:2014;$cmp:K0528,K0543;vreg9:asia,afrika,vest_europa,eu_ost_europa,nord_amerika_oseania,sor_og_mellom_amerika,ost_europa_ellers,norden'
//  }
//]

function makeEmbedConfig(url) {
  return JSON.stringify({
    version: 1,
    url: url
  }, null, 2)
}

function getScriptBaseUrl(env) {
  switch (env) {
    case 'production':
      return '//imdikator.o5.no'
    case 'staging':
      return '//imdikator.o5.no'
    default:
      return ''
  }
}

const SCRIPT_TAG = `<script
  id="imdikator-loader"
  data-api-host="atindikator.azurewebsites.net"
  data-content-api-host="imdi.epinova.no"
  src="${getScriptBaseUrl(process.env.NODE_ENV)}/build/js/loader.js"
  async
  defer
>
</script>`


function getCode(url) {
  return `<div data-imdikator="embed">
  <script type="application/json">
    ${indent(4)(makeEmbedConfig(url))}
  </script>
  Henter figur…
</div>`
}

const CODEMIRROR_OPTS = {
  mode: 'htmlmixed',
  theme: 'solarized dark',
  lineNumbers: true,
  viewportMargin: Infinity
}

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
      editValue: getCode(DEFAULT_URL),
      code: getCode(DEFAULT_URL)
    }
  }

  componentDidMount() {
    if (window[API_GLOBAL]) {
      window[API_GLOBAL].scan()
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.code !== nextState.code) {
      const imdikator = window[API_GLOBAL]
      const components = this.refs.container.querySelectorAll('[data-imdikator=embed]')
      Array.from(components).forEach(el => {
        imdikator.destroy(el)
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.code !== prevState.code) {
      const imdikator = window[API_GLOBAL]
      imdikator.reload(this.refs.container)
    }
  }

  commit(e) {
    e.preventDefault()
    this.setState({code: this.state.editValue})
  }

  render() {

    const {editValue, code} = this.state

    const changed = code !== editValue

    const editExample = newCode => {
      this.setState({editValue: newCode})
    }

    return (
      <div className="wrapper">
        <h2>Indikator embeds debugger</h2>
        <div className="row">
          <h2>Script tag</h2>
          <p>Place this as high up as possible in the document, preferably immediately after {'<head>'}</p>
          <CodeMirror
            value={SCRIPT_TAG}
            options={Object.assign({}, CODEMIRROR_OPTS, {readOnly: true})}
          />
        </div>
        <br/>
        <div className="row">
          <br/>
          <form onSubmit={this.commit.bind(this)}>
            <h2>Embed code</h2>
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'baseline'}}>
              <p style={{flex: 0.7}}>
                Place this where you'd like the chart to appear. Hint: you can edit the code below.
              </p>
              <button style={{float: 'right', margin: 0, visibility: changed ? 'visible' : 'hidden'}} className="button" type="submit">
                Run example
              </button>
            </div>
            <CodeMirror
              value={editValue}
              onChange={editExample}
              options={CODEMIRROR_OPTS}
            />
            {/*
            <select value="-1" onChange={e => {
              this.setState({editValue: getCode(e.target.value)})
            }}>
              <option value="-1">Choose an example url</option>
              {OTHER_EXAMPLES.map(example => {
                return <option value={example.url}>{example.title}</option>
              })}
            </select>
            */}
          </form>
        </div>
        <br/>
        <div className="row">
          <br/>
          <h2>Rendered chart</h2>
          <div className="col--main">
            <div ref="container" dangerouslySetInnerHTML={{__html: code}}/>
          </div>
        </div>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
