import apiClient from '../config/apiClient'
import {RECEIVE_TABLES} from './actions'


export function loadTables() {
  return dispatch => {
    const getTables = apiClient.getTables()
    Promise.all([getTables]).then(([tables]) => {
      dispatch({
        type: RECEIVE_TABLES,
        tables
      })
    })
  }
}
