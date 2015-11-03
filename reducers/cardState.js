import {RECEIVE_QUERY_RESULT} from '../actions/actions'

export default function cardPage(state = {}, action) {
  switch (action.type) {
    case RECEIVE_QUERY_RESULT:
      const {card, tab, query, data} = action

      return Object.assign({}, state, {
        [card.name]: Object.assign({}, state[card.name] || {}, {
          activeTab: tab,
          query: query,
          data: data
        })
      })

    default:
      return state
  }
}
