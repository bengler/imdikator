import apiClient from '../config/apiClient'
import assert from 'assert'
//import createDefaultQueryForCard from '../lib/createDefaultQueryForCard'
import {REQUEST_CARD_QUERY, RECEIVE_CARD_QUERY, OPEN_CARD, CLOSE_CARD, UPDATE_CARD_QUERY} from './actions'


export function performCardQuery({table, card, query}) {
  return (dispatch, getState) => {

    dispatch({
      type: REQUEST_CARD_QUERY,
      card: card,
      query
    })

    return apiClient.query(query).then(result => {
      dispatch({
        type: RECEIVE_CARD_QUERY,
        card: card,
        query,
        result
      })
    })
  }
}

export function openCard(cardName) {
  return (dispatch, state) => {
    dispatch({
      type: OPEN_CARD,
      cardName
    })
  }
}

export function closeCard(cardName) {
  return dispatch => {
    dispatch({
      type: CLOSE_CARD,
      cardName
    })
  }
}

export function updateCardQuery(cardName, query) {
  return {
    type: UPDATE_CARD_QUERY,
    cardName,
    query
  }
}


// Todo: not complete yet

export function loadCardData(cardName, {regionCode, groupName}) {
  assert(cardName, 'Expected cardName option')
  assert(regionCode, 'Expected regionCode option')
  assert(groupName, 'Expected groupName option')
  return dispatch => {

    dispatch({
      type: REQUEST_CARD_QUERY,
      cardName,
      regionCode,
      groupName
    })

    const gotRegion = apiClient.getRegionByCode(regionCode)
    const gotGroup = apiClient.getGroupByName(groupName)
    //const cardName = apiClient.getGroup(regionCode)

    Promise.all([gotRegion, gotGroup]).then(([region, group]) => {
      dispatch({
        type: RECEIVE_CARD_QUERY,
        cardName,
        cardData: {
          region,
          group
        }
      })
    })
  }
}
