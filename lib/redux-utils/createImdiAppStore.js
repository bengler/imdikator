import thunkMiddleware from 'redux-thunk'
import {compose, createStore, applyMiddleware} from 'redux'
import imdiReducers from '../../reducers'
import analyticsMiddleware from './analyticsMiddleware'

const middlewares = [
  applyMiddleware(thunkMiddleware),

  applyMiddleware(analyticsMiddleware((action, state) => {
    console.log(action)
    // ga.track(...)
  })),

].filter(Boolean)

const createStoreWithMiddlewares = compose(...middlewares)(createStore)

export default function createImdiAppStore(initialState = {}) {
  return createStoreWithMiddlewares(imdiReducers, initialState)
}
