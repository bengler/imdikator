import thunkMiddleware from 'redux-thunk'
import {compose, createStore, applyMiddleware} from 'redux'
import imdiReducers from '../../reducers'
import {devTools, persistState} from 'redux-devtools'
//import {logger} from '../middleware'
import config from '../../config'

const middlewares = [
  applyMiddleware(thunkMiddleware),
  //applyMiddleware(logger),

  // Provides support for DevTools
  config.reduxDevTools && devTools(),

  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  config.reduxDevTools && persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
].filter(Boolean)

const createStoreWithMiddlewares = compose(...middlewares)(createStore)

export default function createImdiAppStore(initialState = {}) {
  return createStoreWithMiddlewares(imdiReducers, initialState)
}
