import React from 'react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {navigate} from '../../actions'
import App from '../../components/containers/App'
import app from '../../reducers'
import routes from './routes'
import Router from '../../lib/Router'
import compileRoutes from '../../lib/compileRoutes'

const store = createStore(app)

const router = Router(compileRoutes(routes), match => {
  store.dispatch(navigate(match))
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
  <Provider store={store}>
    {() => <App/>}
  </Provider>,
  containers[0]
)
