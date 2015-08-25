import {combineReducers} from 'redux'
import {NAVIGATE} from '../actions'

function route(state = {}, action) {
  switch (action.type) {
    case NAVIGATE:
      return action.match
    default:
      return state
  }
}

const app = combineReducers({route})

export default app
