import apiClient from '../config/apiClient'

export const RECEIVE_GROUP = 'RECEIVE_GROUP'

export function fetchGroup(groupName) {
  return dispatch => {
    apiClient
      .getGroupByName(groupName)
      .then(group => {
        dispatch({
          type: RECEIVE_GROUP,
          group: group
        })
      })
  }
}
