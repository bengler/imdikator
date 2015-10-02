import {NAVIGATE, SELECT_DATA_VIEW} from './actions'

/* Action creators */
export function navigate(match = {}) {
  return {
    type: NAVIGATE,
    match
  }
}

export function selectDataView(dataView = 'bar') {
  return {
    type: SELECT_DATA_VIEW,
    dataView: dataView
  }
}
