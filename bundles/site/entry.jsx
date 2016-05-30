import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {navigate} from '../../actions/navigate'
import App from '../../components/containers/App'
import createImdiAppStore from '../../lib/redux-utils/createImdiAppStore'
import {setDimensionLabels} from '../../lib/labels'
import routes from './routes'
import Router from '../../lib/Router'
import compileRoutes from '../../lib/compileRoutes'

import apiClient from '../../config/apiClient'

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

function bootstrap(initialState) {
  const store = createImdiAppStore(initialState)
  const router = Router(compileRoutes(routes), match => {
    const Component = match.handler(store.dispatch, match)
    store.dispatch(navigate(Component, match))
  })

  const selector = '[data-imdikator=site]'
  const containers = document.querySelectorAll(selector)
  if (containers.length !== 1) {
    throw new Error(`Expected exactly 1 element container for imdikator (matching ${selector}`)
  }

  router.navigate(document.location.pathname)

  render()

  setTimeout(() => {
    // Need to bind the global click listener *after* react has mounted and bound its global listener to document
    // or else we're not able to stop propagation when we need to
    // Todo: See if this can be solved better
    router.bind(document)
  }, 0)


  function render() {
    ReactDOM.render(
      // The child must be wrapped in a function
      // to work around an issue in React 0.13.
      <div>
        <Provider store={store}>
          <App router={router} />
        </Provider>
      </div>,
      containers[0]
    )
  }
}

const didSetDimensionLabels = apiClient.getDimensionLabels().then(dimensionLabels => {
  setDimensionLabels(dimensionLabels)
})

Promise.all([loadInitialState(), didSetDimensionLabels]).then(([initialState]) => bootstrap(initialState))
