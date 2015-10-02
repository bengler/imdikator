import apiClient from '../config/apiClient'
import {RECEIVE_ALL_REGIONS, REQUEST_REGION, RECEIVE_REGION} from './actions'

export function loadAllRegions() {
  return (dispatch, state) => {

    if (state.allRegions) {
      return
    }

    apiClient.getAllRegions().then(regions => {
      dispatch({
        type: RECEIVE_ALL_REGIONS,
        regions
      })
    })
  }
}
export function loadRegionByCode(regionCode) {
  return (dispatch, state) => {
    dispatch({
      type: REQUEST_REGION,
      regionCode
    })
    return apiClient.getRegionByCode(regionCode)
      .then(region => {
        dispatch({
          type: RECEIVE_REGION,
          region
        })
      })
  }
}
