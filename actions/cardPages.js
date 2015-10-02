import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {queryResultPresenter} from '../lib/queryResultPresenter'
import {prefixify} from '../lib/regionUtil'
import {RECEIVE_REGION, RECEIVE_CARD_PAGE_DATA, RECEIVE_QUERY_RESULT, RECEIVE_CARD_PAGES, RECEIVE_TABLE_HEADERS} from './actions'


export function loadCardPages() {
  return dispatch => {
    apiClient.getCardPages().then(cardPages => {
      dispatch({
        type: RECEIVE_CARD_PAGES,
        cardPages
      })
    })
  }
}

export function performQuery(card, tab, userQuery) {
  return (dispatch, getState) => {
    const {headerGroups, region} = getState()

    const newQuery = Object.assign({}, card.query, tab.query, userQuery, {
      region: prefixify(region)
    })

    const resolvedQuery = resolveQuery(region, newQuery, headerGroups[newQuery.tableName])
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

    getRegion.then(region => {
      dispatch({
        type: RECEIVE_REGION,
        region
      })
    })

    getCardPage.then(cardPage => {
      dispatch({
        type: RECEIVE_CARD_PAGE_DATA,
        cardPage
      })
    })

    if (!activeCardName) {
      return
    }

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

    const getHeaderGroups = getTabQuery.then(tabQuery => {
      return apiClient.getHeaderGroups(tabQuery.tableName)
    })

    const queryResolved = Promise
      .all([getRegion, getTabQuery, getHeaderGroups])
      .then(([region, tabQuery, headerGroups]) => {
        return resolveQuery(region, tabQuery, headerGroups)
      })

    const getQueryResults = queryResolved.then(resolvedQuery => {
      return apiClient.query(resolvedQuery)
    })

    Promise.all([getTabQuery, getHeaderGroups]).then(([tabQuery, headers]) => {
      dispatch({
        type: RECEIVE_TABLE_HEADERS,
        headers,
        tableName: tabQuery.tableName
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
