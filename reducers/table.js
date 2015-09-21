import {RECEIVE_TABLE_HEADERS} from '../actions/table'

export default function tables(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TABLE_HEADERS:
      const newState = {}
      newState[action.tableName] = action.headers
      const res = Object.assign({}, state, newState)
      return res
    default:
      return state
  }
}

