import React, {Component} from 'react'
import DefaultLayout from './DefaultLayout'

class RenderTestPage extends Component {
  render() {

    const extraHead = (
      <script
        id="imdikator-loader"
        data-api-host="atindikator.azurewebsites.net"
        data-content-api-host="www.imdi.no"
        src="/build/js/loader.js" async defer
      />
    )

    return (
      <DefaultLayout extraHead={extraHead}>
        <div data-imdikator="site">
          <script type="application/json"
            dangerouslySetInnerHTML={{__html: '{"some": {"config": "here"}}'}}
          />
          <div className="page">
            <div className="page__content">
              <div className="wrapper">
                <div className="row">
                  <div className="col--main">
                    <h1 className="h2 t-margin-top--large">Vennligst vent</h1>
                    <div className="ingress"><i className="loading-indicator" /> Laster tall og statistikk over integrering ...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
