import {RECEIVE_CARD_PAGE_DATA} from '../actions/ActionTypes'

export default function cardPagesData(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CARD_PAGE_DATA:
      const {cardPageData} = action
      return Object.assign({}, state, {
        [cardPageData.name]: cardPageData
      })
    default:
      return state
  }
}
