import {compose, createStore, applyMiddleware} from 'redux'
import {devTools, persistState} from 'redux-devtools'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'
import {logger} from '../middleware'

const finalCreateStore = compose(
  applyMiddleware(thunkMiddleware),
  applyMiddleware(logger),
  // Provides support for DevTools
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)

export default finalCreateStore(rootReducer, {})
