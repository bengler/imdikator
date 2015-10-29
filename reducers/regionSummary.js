import {RECEIVE_CHART_DATA} from '../actions/actions'

export default function regionSummaryData(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CHART_DATA:
      const data = Object.assign({}, state.data || {}, action.data, {queryKey: action.queryKey})
      return Object.assign({}, state, data)
    default:
      return state
  }
}
