import {compose, createStore, applyMiddleware} from 'redux'
import {devTools, persistState} from 'redux-devtools'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

import config from '../config'

const finalCreateStore = compose.apply(null, [
    applyMiddleware(thunkMiddleware),
    // Provides support for DevTools
    config.reduxDevTools && devTools(),
    // Lets you write ?debug_session=<name> in address bar to persist debug sessions
    config.reduxDevTools && persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  ].filter(Boolean) // (I'm so sorry)
)(createStore)

export default finalCreateStore(rootReducer, {})
