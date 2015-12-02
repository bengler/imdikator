import {REQUEST_VARIABLE_DEFINITIONS, RECEIVE_VARIABLE_DEFINITIONS} from '../actions/ActionTypes'

export default function cards(state = null, action) {
  switch (action.type) {
    case REQUEST_VARIABLE_DEFINITIONS:
      return {loading: true, items: []}
    case RECEIVE_VARIABLE_DEFINITIONS:
      return {items: action.variableDefinitions}
    default:
      return state
  }
}
