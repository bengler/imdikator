import {RECEIVE_CARD_PAGE_DATA, NAVIGATE} from '../actions/actions'

export default function cardPage(state = null, action) {
  switch (action.type) {
    case NAVIGATE:
      if (!action.match.params.pageName) {
        return null
      }
      return state

    case RECEIVE_CARD_PAGE_DATA:
      return action.cardPage
    default:
      return state
  }
}
