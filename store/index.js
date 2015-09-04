import {compose, createStore, applyMiddleware} from 'redux'
import {devTools, persistState} from 'redux-devtools'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

import config from '../config'

const middlewares = [
  applyMiddleware(thunkMiddleware),
  // Provides support for DevTools
  config.reduxDevTools && devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  config.reduxDevTools && persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
].filter(Boolean)

const finalCreateStore = compose.apply(null, middlewares)(createStore)

export default finalCreateStore(rootReducer, {})
