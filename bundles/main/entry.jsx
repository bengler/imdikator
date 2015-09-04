import 'babelify/polyfill'
import React from 'react'
import {DevTools, DebugPanel, LogMonitor} from 'redux-devtools/lib/react';
import {Provider} from 'react-redux'
import {navigate} from '../../actions/navigate'
import App from '../../components/containers/App'
import app from '../../store'
import routes from './routes'
import Router from '../../lib/Router'
import compileRoutes from '../../lib/compileRoutes'

const router = Router(compileRoutes(routes), match => {
  app.dispatch(navigate(match))
})

router.start()

const selector = '[data-imdikator=site]'
const containers = document.querySelectorAll(selector)
if (containers.length !== 1) {
  throw new Error(`Expected exactly 1 element container for imdikator (matching ${selector}`)
}

React.render(
  // The child must be wrapped in a function
  // to work around an issue in React 0.13.
  <div>
    <Provider store={app}>
      {() => <App/>}
    </Provider>
    <DebugPanel top right bottom>
      <DevTools store={app} monitor={LogMonitor} />
    </DebugPanel>
  </div>,
  containers[0]
)
