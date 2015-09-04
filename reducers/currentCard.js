import {combineReducers} from 'redux'
import {SELECT_CURRENT_CARD} from '../actions/cards'

export default function currentCard(state = null, action) {
  switch (action.type) {
    case SELECT_CURRENT_CARD:
      return {
        cardName: action.cardName
      }
    default:
      return state
  }
}
