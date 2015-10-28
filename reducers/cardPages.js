import {RECEIVE_CARD_PAGES} from '../actions/actions'

// "cardPages" consists of config for cards, not actual data to be passed to Card.jsx"
export default function cardPages(state = [], action) {
  switch (action.type) {
    case RECEIVE_CARD_PAGES:
      return action.cardPages
    default:
      return state
  }
}
