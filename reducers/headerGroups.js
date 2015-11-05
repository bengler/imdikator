import {RECEIVE_HEADER_GROUPS} from '../actions/ActionTypes'

export default function tables(state = {}, action) {
  switch (action.type) {
    case RECEIVE_HEADER_GROUPS:
      return Object.assign({}, state, {
        [action.tableName]: action.headerGroups
      })
    default:
      return state
  }
}
