import {RECEIVE_REGION} from '../actions/actions'

export default function region(state = null, action) {
  switch (action.type) {
    case RECEIVE_REGION:
      return action.region
    default:
      return state
  }
}
