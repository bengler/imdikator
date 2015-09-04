import {RECEIVE_GROUP} from '../actions/groups'

export default function group(state = null, action) {
  switch (action.type) {
    case RECEIVE_GROUP:
      return action.group
    default:
      return state
  }
}
