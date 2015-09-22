import {RECEIVE_TABLE_HEADERS} from '../actions/cardPages'

export default function tables(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TABLE_HEADERS:
      return Object.assign({}, state, {
        [action.tableName]: action.headers
      })
    default:
      return state
  }
}

