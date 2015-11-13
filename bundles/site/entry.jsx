import 'babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {DevTools, DebugPanel, LogMonitor} from 'redux-devtools/lib/react'
import {Provider} from 'react-redux'
import {navigate} from '../../actions/navigate'
import App from '../../components/containers/App'
import config from '../../config'
import createImdiAppStore from '../../lib/redux-utils/createImdiAppStore'
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

async function bootstrap() {
  const store = createImdiAppStore(await loadInitialState())
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

  function isDevToolsVisible() {
    return window.localStorage.getItem('reduxDevToolsEnabled') !== 'false'
  }

  function toggleDevToolsVisibility() {
    window.localStorage.setItem('reduxDevToolsEnabled', isDevToolsVisible() ? 'false' : 'true')
    render()
  }

  render()

  setTimeout(() => {
    // Need to bind the global click listener *after* react has mounted and bound its global listener to document
    // or else we're not able to stop propagation when we need to
    // Todo: See if this can be solved better
    router.bind(document)
  }, 0)

  function ReduxDevToolsPanel() {
    if (!config.reduxDevTools) {
      return <span/>
    }
    const devToolsIsVisible = isDevToolsVisible()

    if (!devToolsIsVisible) {
      const buttonStyle = {fontSize: 10, width: 150, position: 'fixed', top: 0, right: 0}
      return (
        <button style={buttonStyle} onClick={toggleDevToolsVisibility}>
          Show Redux Devtools
        </button>
      )
    }
    return (
      <DebugPanel style={{backgroundColor: '#444'}} top right bottom>
        <div style={{padding: 4}}>
          Pro tip: Turn off redux devtools with:
          <input
            type="text" readOnly
            onFocus={e => (target => setTimeout(() => target.select(), 0))(e.target)}
            style={{margin: 0, lineHeight: 1, color: 'inherit', backgroundColor: 'inherit', padding: 2, border: '1px solid #aaa'}}
            value="REDUX_DEVTOOLS=0 npm start"
          />
          <div style={{marginTop: 5}}>
            You can also <a href="#" style={{color: 'lightblue', padding: 2}} onClick={toggleDevToolsVisibility}>
            Hide this panel &raquo;
          </a></div>
        </div>
        <DevTools store={store} monitor={LogMonitor}/>
      </DebugPanel>
    )
  }

  function render() {
    ReactDOM.render(
      // The child must be wrapped in a function
      // to work around an issue in React 0.13.
      <div>
        <Provider store={store}>
          <App router={router}/>
        </Provider>
        <ReduxDevToolsPanel/>
      </div>,
      containers[0]
    )
  }
}

bootstrap()
