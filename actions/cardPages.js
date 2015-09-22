import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {queryResultPresenter} from '../lib/queryResultPresenter'

export const LOAD_CARD_PAGE = 'LOAD_CARD_PAGE'
export const RECEIVE_CARD_PAGE_DATA = 'RECEIVE_CARD_PAGE_DATA'
export const RECEIVE_QUERY_RESULT = 'RECEIVE_QUERY_RESULT'

import {RECEIVE_TABLE_HEADERS} from '../actions/table'

export function performQuery(card, newQuery) {
  return (dispatch, getState) => {
    const state = getState()

    const {query} = state

    const srcQuery = Object.assign({}, query, newQuery)

    apiClient.query(srcQuery).then(queryResults => {
      dispatch({
        type: RECEIVE_QUERY_RESULT,
        cardName: card.name,
        query: srcQuery,
        data: queryResultPresenter(srcQuery, queryResults, card)
      })
    })
  }
}

export function loadCardPage({regionCode, pageName, activeCardName, activeTabName, query}) {
  return dispatch => {
    const getCardPage = apiClient.getCardPageByName(pageName)

    const getRegion = apiClient.getRegionByCode(regionCode)

    const getActiveCard = getCardPage.then(cardPage => {
      return cardPage.cards.find(card => card.name === activeCardName)
    })

    const getActiveTab = getActiveCard.then(card => {
      return card.tabs.find(tab => tab.name === (activeTabName || 'latest'))
    })

    const getTabQuery = Promise.all([getActiveCard, getActiveTab]).then(([activeCard, activeTab]) => {
      return Object.assign({}, activeCard.query, activeTab.query, query, {
        region: regionCode
      })
    })

    const getHeadersWithValues = getTabQuery.then(tabQuery => {
      return apiClient.getHeadersForTable(tabQuery.tableName)
    })

    Promise.all([getTabQuery, getHeadersWithValues]).then(([tabQuery, headers]) => {
      dispatch({
        type: RECEIVE_TABLE_HEADERS,
        headers,
        tableName: tabQuery.tableName
      })
    })

    const queryResolved = Promise
      .all([getTabQuery, getHeadersWithValues])
      .then(([tabQuery, headersWithValues]) => {
        return resolveQuery(tabQuery, headersWithValues)
      })

    const getQueryResults = queryResolved.then(resolvedQuery => {
      return apiClient.query(resolvedQuery)
    })

    Promise
      .all([queryResolved, getCardPage, getRegion, getQueryResults])
      .then(([resolvedQuery, cardPage, region, queryResults]) => {
        dispatch({
          type: RECEIVE_CARD_PAGE_DATA,
          cardPage,
          region
        })

        const config = cardPage.cards.find(card => card.name === activeCardName)

        dispatch({
          type: RECEIVE_QUERY_RESULT,
          cardName: activeCardName,
          query: resolvedQuery,
          data: queryResultPresenter(resolvedQuery, queryResults, config)
        })
      })
  }
}
