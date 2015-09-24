import {RECEIVE_ALL_REGIONS} from '../actions/region'

export default function region(state = [], action) {
  switch (action.type) {
    case RECEIVE_ALL_REGIONS:
      return action.regions
    default:
      return state
  }
}
