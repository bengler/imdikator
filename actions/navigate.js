import {NAVIGATE} from './actions'
import {loadRegionByCode} from './region'

/* Action creators */
export function navigate(match = {}) {
  return dispatch => {
    const {params} = match
    if (params.region) {
      const [regionCode] = params.region.split('-')
      dispatch(loadRegionByCode(regionCode))
    }
    dispatch({
      type: NAVIGATE,
      match
    })
  }
}
