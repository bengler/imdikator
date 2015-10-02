import {RECEIVE_ALL_REGIONS} from '../actions/actions'

export default function allRegions(state = [], action) {
  switch (action.type) {
    case RECEIVE_ALL_REGIONS:
      return action.regions
    default:
      return state
  }
}
