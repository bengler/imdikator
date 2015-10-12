import {NAVIGATE} from './actions'
import {loadRegionByCode} from './region'

/* Action creators */
export function navigate(match = {}) {
  return dispatch => {
    const {params} = match
    if (params.region) {
      dispatch(loadRegionByCode(params.region))
    }
    dispatch({
      type: NAVIGATE,
      match
    })
  }
}
