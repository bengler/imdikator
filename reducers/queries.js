import {RECEIVE_CARD_GROUP} from '../actions/cardGroup'

export default function queries(state = {}, action) {
  switch (action.type) {
    case QUERY_CARD:
      return action.cardGroup.cards.map(card => {
        return Object.assign({}, card, {
          query: {},
          data: {}
        })
      })
    default:
      return state
  }
}


