import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {queryResultPresenter} from '../lib/queryResultPresenter'
import {prefixify} from '../lib/regionUtil'

export const LOAD_CARD_PAGE = 'LOAD_CARD_PAGE'
export const RECEIVE_REGION = 'RECEIVE_REGION'
export const RECEIVE_CARD_PAGE_DATA = 'RECEIVE_CARD_PAGE_DATA'
export const RECEIVE_QUERY_RESULT = 'RECEIVE_QUERY_RESULT'
export const RECEIVE_TABLE_HEADERS = 'RECEIVE_TABLE_HEADERS'

export function performQuery(card, tab, userQuery) {
  return (dispatch, getState) => {
    const state = getState()
    const {tableHeaders} = state

    const newQuery = Object.assign({}, card.query, tab.query, userQuery, {
      region: prefixify(state.region)
    })

    const resolvedQuery = resolveQuery(newQuery, tableHeaders[newQuery.tableName])
    apiClient.query(resolvedQuery).then(queryResults => {
      dispatch({
        type: RECEIVE_QUERY_RESULT,
        card,
        tab,
        userQuery,
        query: resolvedQuery,
        data: queryResultPresenter(resolvedQuery, queryResults, tab)
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
      return card.tabs.find(tab => tab.name === activeTabName)
    })

    const getTabQuery = Promise.all([getActiveCard, getActiveTab]).then(([activeCard, activeTab]) => {
      return Object.assign({}, activeCard.query, activeTab.query, query, {
        region: regionCode
      })
    })

    const getHeadersWithValues = getTabQuery.then(tabQuery => {
      return apiClient.getHeadersForTable(tabQuery.tableName)
    })

    const queryResolved = Promise
      .all([getTabQuery, getHeadersWithValues])
      .then(([tabQuery, headersWithValues]) => {
        return resolveQuery(tabQuery, headersWithValues)
      })

    const getQueryResults = queryResolved.then(resolvedQuery => {
      return apiClient.query(resolvedQuery)
    })

    getRegion.then(region => {
      dispatch({
        type: RECEIVE_REGION,
        region
      })
    })

    Promise.all([getTabQuery, getHeadersWithValues]).then(([tabQuery, headers]) => {
      dispatch({
        type: RECEIVE_TABLE_HEADERS,
        headers,
        tableName: tabQuery.tableName
      })
    })

    getCardPage.then(cardPage => {
      dispatch({
        type: RECEIVE_CARD_PAGE_DATA,
        cardPage
      })
    })

    Promise
      .all([queryResolved, getActiveCard, getActiveTab, getRegion, getQueryResults])
      .then(([resolvedQuery, activeCard, activeTab, region, queryResults]) => {
        dispatch({
          type: RECEIVE_QUERY_RESULT,
          card: activeCard,
          tab: activeTab,
          query: resolvedQuery,
          data: queryResultPresenter(resolvedQuery, queryResults, activeTab)
        })
      })
  }
}
