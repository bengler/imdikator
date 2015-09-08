import apiClient from '../config/apiClient'

export const LOAD_CARD_PAGE = 'LOAD_CARD_PAGE'
export const RECEIVE_CARD_PAGE_DATA = 'RECEIVE_CARD_PAGE_DATA'

export function loadCardPage({regionCode, pageName, activeCard}) {
  return dispatch => {
    const getCardPage = apiClient.getCardPageByName(pageName)

    const getRegion = apiClient.getRegionByCode(regionCode)

    Promise.all([getCardPage, getRegion]).then(([cardPage, region]) => {
      dispatch({
        type: RECEIVE_CARD_PAGE_DATA,
        cardPage,
        region
      })
    })
  }
}
