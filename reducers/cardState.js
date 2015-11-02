import {RECEIVE_QUERY_RESULT, SET_TABLE_VISIBILITY} from '../actions/actions'

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

    case SET_TABLE_VISIBILITY:
      return Object.assign({}, state, {
        [action.cardName]: Object.assign({}, state[action.cardName] || {}, {
          showTable: action.showTable
        })
      })

    default:
      return state
  }
}
