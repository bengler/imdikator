import {REQUEST_VARIABLE_DEFINITIONS, RECEIVE_VARIABLE_DEFINITIONS} from './ActionTypes'
import apiClient from '../config/apiClient'

/** Action creators */
function requestVariableDefinitions() {
  return {
    type: REQUEST_VARIABLE_DEFINITIONS
  }
}

function receiveVariableDefinitions(variableDefinitions) {
  return {
    type: RECEIVE_VARIABLE_DEFINITIONS,
    variableDefinitions
  }
}

/* actions */
export function fetchVariableDefinitions() {
  return (dispatch, getState) => {
    if (getState().variableDefinitions) {
      return
    }
    dispatch(requestVariableDefinitions())
    apiClient.getVariableDefinitions().then(variableDefinitions => {
      dispatch(receiveVariableDefinitions(variableDefinitions))
    })
  }
}
