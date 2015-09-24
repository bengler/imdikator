import apiClient from '../config/apiClient'

export const REQUEST_REGION = 'REQUEST_REGION'
export const RECEIVE_REGION = 'RECEIVE_REGION'
export const RECEIVE_ALL_REGIONS = 'RECEIVE_ALL_REGIONS'

export function loadAllRegions() {
  return (dispatch, state) => {

    const regionsLoaded = state.allRegions ? Promise.resolve(state.allRegions) : apiClient.getAllRegions()

    regionsLoaded.then(regions => {
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
