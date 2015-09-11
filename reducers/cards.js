import {RECEIVE_QUERY_RESULT} from '../actions/cards'

export default function queryResult(state = {}, action) {
  switch (action.type) {
    case RECEIVE_QUERY_RESULT:
      const newState = {}
      newState[action.cardName] = action.data
      return Object.assign({}, state, newState)
    default:
      return state
  }
}
