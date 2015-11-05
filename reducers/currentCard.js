import {SET_CURRENT_CARD} from '../actions/ActionTypes'

export default function currentCard(state = null, action) {
  switch (action.type) {
    case SET_CURRENT_CARD:
      return action.card
    default:
      return state
  }
}
