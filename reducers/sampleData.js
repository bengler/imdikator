import {RECEIVE_SAMPLE_DATA, REQUEST_SAMPLE_DATA} from '../actions/cards'

export default function sampleData(state = {}, action) {
  switch (action.type) {
    case REQUEST_SAMPLE_DATA:
      return state
    case RECEIVE_SAMPLE_DATA:
      const newState = {}
      newState[action.cardName] = action.data
      return Object.assign({}, state, newState)
    default:
      return state
  }
}
