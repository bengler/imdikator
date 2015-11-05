import {SET_CURRENT_REGION} from '../actions/ActionTypes'

export default function region(state = null, action) {
  switch (action.type) {
    case SET_CURRENT_REGION:
      return action.region
    default:
      return state
  }
}
