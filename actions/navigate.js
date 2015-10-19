import {NAVIGATE} from './actions'
import {loadRegionByCode} from './region'

/* Action creators */
export function navigate(match = {}) {
  return dispatch => {
    const {params} = match
    if (params.region) {
      const prefixedRegionCode = params.region.split('-')[0].toUpperCase()
      dispatch(loadRegionByCode(prefixedRegionCode))
    }
    dispatch({
      type: NAVIGATE,
      match
    })
  }
}
