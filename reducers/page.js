import {NAVIGATE} from '../actions/ActionTypes'

export default function allRegions(state = null, action) {
  switch (action.type) {
    case NAVIGATE:
      return action.PageComponent
    default:
      return state
  }
}
