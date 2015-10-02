import 'babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {DevTools, DebugPanel, LogMonitor} from 'redux-devtools/lib/react'
import {Provider} from 'react-redux'
import {navigate} from '../../actions/navigate'
import App from '../../components/containers/App'
import config from '../../config'
import app from '../../store'
import routes from './routes'
import Router from '../../lib/Router'
import compileRoutes from '../../lib/compileRoutes'

const router = Router(compileRoutes(routes), match => {
  app.dispatch(navigate(match))
})

const selector = '[data-imdikator=site]'
const containers = document.querySelectorAll(selector)
if (containers.length !== 1) {
  throw new Error(`Expected exactly 1 element container for imdikator (matching ${selector}`)
}

router.navigate(document.location.pathname)

ReactDOM.render(
  // The child must be wrapped in a function
  // to work around an issue in React 0.13.
  <div>
    <Provider store={app}>
      <App router={router}/>
    </Provider>

    {config.reduxDevTools && (
      <DebugPanel style={{backgroundColor: '#444'}} top right bottom>
        <div style={{padding: 4}}>
          Pro tip: Turn off redux devtools with:
          <input type="text" readOnly
                 onFocus={e => (target => setTimeout(() => target.select(), 0))(e.target)}
                 style={{margin: 0, lineHeight: 1, color: 'inherit', backgroundColor: 'inherit', padding: 2, border: '1px solid #aaa'}}
                 value="REDUX_DEVTOOLS=0 npm start"/>
        </div>
        <DevTools store={app} monitor={LogMonitor} />
      </DebugPanel>
    )}
  </div>,
  containers[0]
)

setTimeout(() => {
  // Need to bind the global click listener *after* react has mounted and bound its global listener to document
  // or else we're not able to stop propagation when we need to
  // Todo: See if this can be solved better
  router.bind(document)
}, 0)
