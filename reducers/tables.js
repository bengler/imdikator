import {RECEIVE_TABLES} from '../actions/tables'
import tableMetadata from '../data/tables'

export default function tables(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TABLES: {
      const tableMap = {}
      action.tables.forEach(table => {
        const metadata = tableMetadata.find(item => item.label === table)
        if (metadata) {
          tableMap[table] = metadata
        } else {
          console.log('Missing metadata for', table) // eslint-disable-line
        }
      })
      return tableMap
    }
    default:
      return state
  }
}
