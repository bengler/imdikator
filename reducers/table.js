import {RECEIVE_TABLE_HEADERS} from '../actions/table'

export default function tables(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TABLE_HEADERS:
      const newState = {}
      newState[action.table] = action.headers
      return Object.assign({}, state, newState)
    default:
      return state
  }
}

