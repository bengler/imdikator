import apiClient from '../config/apiClient'

export const REQUEST_REGION = 'REQUEST_REGION'
export const RECEIVE_REGION = 'RECEIVE_REGION'

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
