import {RECEIVE_CHART_DATA} from '../actions/chartFodder'

export default function chartData(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CHART_DATA:
      const data = Object.assign({}, state.data || {}, action.data)
      return Object.assign({}, state, data)
    default:
      return state
  }
}
