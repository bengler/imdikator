// Todo: not complete yet
import {combineReducers} from 'redux'
import {REQUEST_CARD_DATA, RECEIVE_CARD_DATA} from '../actions/cards'

export default function cards(state = [], action) {
  switch (action.type) {
    case REQUEST_CARD_DATA:
      return state
    case RECEIVE_CARD_DATA:
      return state.cards.concat({
        cardName: action.cardName,
        requesting: false,
        region: action.region,
        group: action.group
      })
    default:
      return state
  }
}
