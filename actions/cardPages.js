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

    const getHeadersWithValues = getActiveCard.then(activeCard => {
      return apiClient.getHeadersForTable(activeCard.query.tableName)
    })

    Promise.all([getActiveCard, getHeadersWithValues]).then(([activeCard, headers]) => {
      dispatch({
        type: RECEIVE_TABLE_HEADERS,
        headers,
        tableName: activeCard.query.tableName
      })
    })

    const getQuery = query ? Promise.resolve(Object.assign({}, query)) : getActiveCard.then(activeCard => activeCard.query)

    const createQuery = Promise
      .all([getActiveCard, getQuery, getHeadersWithValues])
      .then(([activeCard, currentQuery, headersWithValues]) => {
        const activeTab = activeCard.tabs.find(tab => tab.name == activeTabName)
        const queryWithTimeAndRegion = Object.assign({}, currentQuery)
        queryWithTimeAndRegion.region = regionCode
        queryWithTimeAndRegion.time = activeTab.time
        return resolveQuery(queryWithTimeAndRegion, headersWithValues)
      })

    const getQueryResults = createQuery.then(q => {
      return apiClient.query(q)
    })

    Promise
      .all([createQuery, getCardPage, getRegion, getQueryResults])
      .then(([srcQuery, cardPage, region, queryResults]) => {
        dispatch({
          type: RECEIVE_CARD_PAGE_DATA,
          cardPage,
          region
        })

        const config = cardPage.cards.find(card => card.name === activeCardName)

        dispatch({
          type: RECEIVE_QUERY_RESULT,
          cardName: activeCardName,
          query: srcQuery,
          data: queryResultPresenter(srcQuery, queryResults, config)
        })
      })
  }
}
