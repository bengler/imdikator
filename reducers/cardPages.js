import {RECEIVE_CARD_PAGES} from '../actions/actions'

export default function cardPages(state = [], action) {
  switch (action.type) {
    case RECEIVE_CARD_PAGES:
      return action.cardPages
    default:
      return state
  }
}
