import {RECEIVE_CHART_DATA} from '../actions/chartFodder'

export default function chartData(state = null, action) {
  switch (action.type) {
    case RECEIVE_CHART_DATA:
      return action.chartData
    default:
      return state
  }
}
