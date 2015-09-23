import {RECEIVE_CARD_PAGES} from '../actions/cardPages'

export default function cardPage(state = [], action) {
  switch (action.type) {
    case RECEIVE_CARD_PAGES:
      return action.cardPages
    default:
      return state
  }
}
