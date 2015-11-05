import {NAVIGATE} from '../actions/ActionTypes'

export default function route(state = {}, action) {
  switch (action.type) {
    case NAVIGATE:
      return action.match
    default:
      return state
  }
}
