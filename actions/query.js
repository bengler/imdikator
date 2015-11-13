import apiClient from '../config/apiClient'
import {
  RECEIVE_CARD_QUERY_RESULT,
  REQUEST_CARD_QUERY_RESULT
} from './ActionTypes'

/** Action creators */

function requestQueryResult({cardsPage, query, card, tab, region, headerGroups, queryResult}) {
  return {
    type: REQUEST_CARD_QUERY_RESULT,
    cardsPage,
    card,
    tab,
    query,
    region,
    headerGroups,
    queryResult
  }
}

function receiveQueryResult({cardsPage, card, tab, region, headerGroups, query, queryResult}) {
  return {
    type: RECEIVE_CARD_QUERY_RESULT,
    cardsPage,
    card,
    tab,
    region,
    headerGroups,
    query,
    queryResult
  }
}

/** Actions */
export function performQuery({region, cardsPage, card, tab, query}) {
  if (!cardsPage) {
    throw new Error('Missing required option: cardsPage')
  }
  if (!card) {
    throw new Error('Missing required option: card')
  }
  if (!tab) {
    throw new Error('Missing required option: tab')
  }
  return dispatch => {

    dispatch(requestQueryResult({
      region: region,
      cardsPage: cardsPage,
      card: card,
      tab: tab,
      query: query
    }))

    const getHeaderGroups = apiClient.getHeaderGroups(query.tableName)
    Promise.all([apiClient.query(query), getHeaderGroups]).then(([queryResult, headerGroups]) => {
      dispatch(receiveQueryResult({
        region: region,
        cardsPage: cardsPage,
        card: card,
        tab: tab,
        headerGroups: headerGroups,
        query: query,
        queryResult
      }))
    })
  }
}
