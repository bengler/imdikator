import {SET_CURRENT_TAB} from '../actions/ActionTypes'

export default function currentTab(state = null, action) {
  switch (action.type) {
    case SET_CURRENT_TAB:
      return action.tab
    default:
      return state
  }
}
