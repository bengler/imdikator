import {REQUEST_REGION_SUMMARY_DATA, RECEIVE_REGION_SUMMARY_DATA} from '../actions/ActionTypes'


function reduceSummary(state = {}, action) {
  switch (action.type) {
    case REQUEST_REGION_SUMMARY_DATA:
      return Object.assign({}, state, {
        loading: true,
        query: null,
        queryResult: null
      })
    case RECEIVE_REGION_SUMMARY_DATA:
      return Object.assign({}, state, {
        loading: false,
        query: action.query,
        queryResult: action.queryResult
      })
    default:
      return state
  }
}

function reduceSummaryForRegion(state = {}, action) {
  switch (action.type) {
    case REQUEST_REGION_SUMMARY_DATA:
    case RECEIVE_REGION_SUMMARY_DATA:
      return Object.assign({}, state, {
        [action.summaryConfig.name]: reduceSummary(state[action.summaryConfig.name], action)
      })
    default:
      return state
  }
}


export default function regionSummaries(state = {}, action) {
  switch (action.type) {
    case REQUEST_REGION_SUMMARY_DATA:
    case RECEIVE_REGION_SUMMARY_DATA:
      return Object.assign({}, state, {
        [action.region.prefixedCode]: reduceSummaryForRegion(state[action.region.prefixedCode], action)
      })
    default:
      return state
  }
}
