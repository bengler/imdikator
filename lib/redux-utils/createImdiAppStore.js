import thunkMiddleware from 'redux-thunk'
import {compose, createStore, applyMiddleware} from 'redux'
import imdiReducers from '../../reducers'
//import {logger} from '../middleware'

const middlewares = [
  applyMiddleware(thunkMiddleware),
  //applyMiddleware(logger),
].filter(Boolean)

const createStoreWithMiddlewares = compose(...middlewares)(createStore)

export default function createImdiAppStore(initialState = {}) {
  return createStoreWithMiddlewares(imdiReducers, initialState)
}
