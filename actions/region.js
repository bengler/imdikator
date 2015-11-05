import {SET_CURRENT_REGION, REGION_NOT_FOUND} from './ActionTypes'

/** Action creators */
function _setCurrentRegion(region) {
  return {
    type: SET_CURRENT_REGION,
    region: region
  }
}

function regionNotFound(code) {
  return {
    type: REGION_NOT_FOUND,
    code: code
  }
}

/* actions */
export function setCurrentRegionByCode(regionCode) {
  return (dispatch, getState) => {
    const {currentRegion, allRegions} = getState()
    if (currentRegion && currentRegion.code == regionCode) {
      return currentRegion
    }

    const foundRegion = allRegions.find(region => region.prefixedCode.toLowerCase() === regionCode.toLowerCase())

    if (!foundRegion) {
      dispatch(regionNotFound(regionCode))
      return null
    }

    dispatch(setCurrentRegion(foundRegion))
    return foundRegion
  }
}

export function setCurrentRegion(region) {
  return (dispatch, getState) => {
    const {currentRegion} = getState()
    if (currentRegion === region) {
      return
    }
    dispatch(_setCurrentRegion(region))
  }
}
