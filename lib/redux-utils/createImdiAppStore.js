import thunkMiddleware from 'redux-thunk'
import {compose, createStore, applyMiddleware} from 'redux'
import imdiReducers from '../../reducers'
import analyticsMiddleware from './analyticsMiddleware'
import {logCustomPageView, logCustomEvent} from '../googleTagManager'

import {
  NAVIGATE,
  GOOGLE_TAG_MANAGER_EVENT
} from '../../actions/ActionTypes'


const middlewares = [
  applyMiddleware(thunkMiddleware),

  applyMiddleware(analyticsMiddleware((action, state) => {
    if (action.type == NAVIGATE) {
      logCustomPageView(action, state)
    }
    if (action.type == GOOGLE_TAG_MANAGER_EVENT) {
      logCustomEvent(action, state)
    }
  })),

].filter(Boolean)

const createStoreWithMiddlewares = compose(...middlewares)(createStore)

export default function createImdiAppStore(initialState = {}) {
  return createStoreWithMiddlewares(imdiReducers, initialState)
}
