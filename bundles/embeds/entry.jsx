import 'babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import EmbeddedChartContainer from '../../components/containers/EmbeddedChartContainer'
import createImdiAppStore from '../../lib/redux-utils/createImdiAppStore'
import {Provider} from 'react-redux'
import compileRoutes from '../../lib/compileRoutes'
import {loadEmbedData} from '../../actions/embeds'
import {API_GLOBAL, SELECTOR_EMBED} from '../common'

import apiClient from '../../config/apiClient'

const routes = compileRoutes({
  '/indikator/steder/:regionCode/:cardsPageName/:cardName/:tabName'() {
  }
})

function parseEmbedUrl(url) {
  return routes.match(url).params
}
function readConfig(element) {
  const json = element.querySelector('script').innerHTML
  try {
    return JSON.parse(json)
  } catch (error) {
    throw new Error(`Error parsing embed config: ${error.message}`)
  }
}

function loadInitialState() {
  // Load resources that is needed throughout the apps life time, e.g. cardPages, all regions
  const gotAllRegions = apiClient.getAllRegions()
  const gotCardsPages = apiClient.getCardsPages()

  return Promise.all([gotAllRegions, gotCardsPages]).then(([allRegions, allCardsPages]) => {
    return {
      allRegions,
      allCardsPages
    }
  })
}


async function bootstrap() {
  const store = createImdiAppStore(await loadInitialState())

  const API = window[API_GLOBAL] = window[API_GLOBAL] || {}

  if (API.reload) {
    throw new Error('Imdikator embeds API loaded twice')
  }

  API.reload = setupElements

  API.destroy = function destroy(el) {
    ReactDOM.unmountComponentAtNode(el)
  }

  setupElements()

  function setupElements(root = document) {
    const elements = root.querySelectorAll(SELECTOR_EMBED)

    Array.from(elements).forEach(el => {
      const config = readConfig(el)
      const params = parseEmbedUrl(config.url)
      store.dispatch(loadEmbedData(params))

      render(params, el)
    })
  }

  function render(params, element) {

    const {regionCode, cardsPageName, cardName, tabName} = params
    ReactDOM.render(
      (
        <Provider store={store}>
          <EmbeddedChartContainer
            regionCode={regionCode}
            cardsPageName={cardsPageName}
            cardName={cardName}
            tabName={tabName}
          />
        </Provider>
      ),
      element
    )
  }
}


bootstrap()
