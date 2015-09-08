// Todo: not complete yet

import apiClient from '../config/apiClient'
import assert from 'assert'

export const REQUEST_CARD_DATA = 'REQUEST_CARD_DATA'
export const RECEIVE_CARD_DATA = 'RECEIVE_CARD_DATA'
export const SELECT_CURRENT_CARD = 'SELECT_CURRENT_CARD'
export const SELECT_CURRENT_DATA_VIEW = 'SELECT_CURRENT_DATA_VIEW'

export const REQUEST_SAMPLE_DATA = 'REQUEST_SAMPLE_DATA'
export const RECEIVE_SAMPLE_DATA = 'RECEIVE_SAMPLE_DATA'

export function selectCurrentCard(cardName) {
  return dispatch => dispatch({
    type: SELECT_CURRENT_CARD,
    cardName
  })
}

export function fetchCardData(cardName, {regionCode, groupName}) {
  assert(cardName, 'Expected cardName option')
  assert(regionCode, 'Expected regionCode option')
  assert(groupName, 'Expected groupName option')
  return dispatch => {

    dispatch({
      type: REQUEST_CARD_DATA,
      cardName,
      regionCode,
      groupName
    })

    const gotRegion = apiClient.getRegionByCode(regionCode)
    const gotGroup = apiClient.getGroupByName(groupName)
    //const cardName = apiClient.getGroup(regionCode)

    Promise.all([gotRegion, gotGroup]).then(([region, group]) => {
      dispatch({
        type: RECEIVE_CARD_DATA,
        cardName,
        cardData: {
          region,
          group
        }
      })
    })
  }
}

export function fetchSampleData(cardName, sampleDataName) {
  assert(cardName, 'Expected cardName option')
  assert(sampleDataName, 'Expected sampleDataName option')

  return dispatch => {
    dispatch({
      type: REQUEST_SAMPLE_DATA,
      cardName,
      sampleDataName
    })

    const gotSampleData = apiClient.getSampleData(sampleDataName)
    Promise.all([gotSampleData]).then(([data]) => {
      dispatch({
        type: RECEIVE_SAMPLE_DATA,
        cardName,
        data
      })
    })
  }
}
