import React, {Component} from 'react'
import DefaultLayout from './DefaultLayout'

class RenderTestPage extends Component {
  render() {

    const extraHead = (
      <script id="imdikator-loader" data-api-host="imdikator-st.azurewebsites.net" src="/build/js/loader.js" async defer/>
    )

    return (
      <DefaultLayout extraHead={extraHead}>
        <div data-imdikator="site">
          <script type="application/json"
            dangerouslySetInnerHTML={{__html: '{"some": {"config": "here"}}'}}
          />
            Laster indikator…
          </div>
      </DefaultLayout>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
