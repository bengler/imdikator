export const RECEIVE_TABLES = 'RECEIVE_TABLES'
import apiClient from '../config/apiClient'

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
