import {RECEIVE_CARD_PAGE_DATA} from '../actions/actions'

export default function cardPage(state = null, action) {
  switch (action.type) {
    case RECEIVE_CARD_PAGE_DATA:
      return action.cardPage
    default:
      return state
  }
}
