export const NAVIGATE = 'NAVIGATE'
export const SELECT_DATA_VIEW = 'SELECT_DATA_VIEW'

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
