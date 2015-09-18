import {RECEIVE_QUERY_RESULT} from '../actions/cards'

export default function queries(state = {}, action) {
  switch (action.type) {
    case RECEIVE_QUERY_RESULT:
      return Object.assign({}, state, {
        [action.cardName]: action.query
      })
    default:
      return state
  }
}
