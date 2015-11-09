import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {getQuerySpec, constrainQuery} from '../lib/querySpec'
import {findHeaderGroupForQuery} from '../lib/queryUtil'
import {isSimilarRegion} from '../lib/regionUtil'
import {setCurrentRegionByCode} from './region'
import {CHARTS} from '../config/chartTypes'

import {TABS} from '../config/tabs'
import {
  CARD_PAGE_NOT_FOUND,
  //CARD_PAGE_TAB_NOT_FOUND,
  CLOSE_CARD,
  OPEN_CARD,
  CARD_NOT_FOUND_IN_PAGE,
  TAB_NOT_FOUND_IN_CARD,
  SET_CURRENT_CARDS_PAGE,
  SET_CURRENT_CARD,
  SET_CURRENT_TAB,
  RECEIVE_CARD_QUERY_RESULT,
  REQUEST_CARD_QUERY_RESULT,
  RECEIVE_HEADER_GROUPS,
  NO_DATA_FOR_CARD
} from './ActionTypes'


/** Action creators */
function cardsPageNotFound(cardsPageName) {
  return {
    type: CARD_PAGE_NOT_FOUND,
    name: cardsPageName
  }
}

function setCurrentCardsPage(cardsPage) {
  return {
    type: SET_CURRENT_CARDS_PAGE,
    cardsPage: cardsPage
  }
}

function setCurrentCard(card) {
  return {
    type: SET_CURRENT_CARD,
    card: card
  }
}

function _openCard(cardName) {
  return {
    type: OPEN_CARD,
    cardName: cardName
  }
}

function _closeCard(cardName) {
  return {
    type: CLOSE_CARD,
    cardName: cardName
  }
}

function setCurrentTab({region, card, tab}) {
  return {
    type: SET_CURRENT_TAB,
    region,
    card,
    tab
  }
}

function receivedHeaderGroups({tableName, headerGroups}) {
  return {
    type: RECEIVE_HEADER_GROUPS,
    tableName: tableName,
    headerGroups
  }
}

function noDataForCard({cardsPage, card, tab, region}) {
  return {
    type: NO_DATA_FOR_CARD,
    cardsPage,
    card,
    tab,
    region
  }
}

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

function cardNotFoundInPage({cardsPage, cardName}) {
  return {
    type: CARD_NOT_FOUND_IN_PAGE,
    cardsPage,
    cardName
  }
}

function tabNotFoundInCard({card, tabName}) {
  return {
    type: TAB_NOT_FOUND_IN_CARD,
    card,
    tabName
  }
}

/** Actions */

function loadHeaderGroupsForTable(tableName) {
  return (dispatch, getState) => {
    const state = getState()
    if (state.headerGroups[tableName]) {
      return Promise.resolve(state.headerGroups[tableName])
    }
    return apiClient.getHeaderGroups(tableName).then(headerGroups => {
      dispatch(receivedHeaderGroups({tableName, headerGroups}))
      return headerGroups
    })
  }
}

export function closeCard(cardName) {
  return dispatch => {
    dispatch(_closeCard(cardName))
  }
}

export function openCard(cardName) {
  return dispatch => {
    dispatch(_openCard(cardName))
  }
}

export function loadCardsPage(regionCode, cardsPageName, {cardName, tabName, query} = {}) {
  return (dispatch, getState) => {
    const region = dispatch(setCurrentRegionByCode(regionCode))

    if (!region) {
      // Probably means region wasnt found
      return
    }
    const {allCardsPages, headerGroups} = getState()

    const foundCardsPage = allCardsPages.find(cardsPage => cardsPage.name.toLowerCase() === cardsPageName.toLowerCase())

    if (!foundCardsPage) {
      dispatch(cardsPageNotFound(foundCardsPage))
      return
    }

    // Load header groups for all cards in cardPage
    foundCardsPage.cards.forEach(card => {
      if (!headerGroups[card.query.tableName]) {
        dispatch(loadHeaderGroupsForTable(card.query.tableName))
      }
    })

    dispatch(setCurrentCardsPage(foundCardsPage))

    if (!cardName) {
      cardName = foundCardsPage.cards[0].name
    }

    const foundCard = foundCardsPage.cards.find(card => card.name === cardName)

    if (!foundCard) {
      dispatch(cardNotFoundInPage(foundCardsPage, cardName))
      return
    }

    dispatch(setCurrentCard(foundCardsPage))

    if (!tabName) {
      tabName = TABS[0].name
    }

    // Tabs are fixed across all, not configured
    const foundTab = TABS.find(tab => {
      return tab.name.toLowerCase() == tabName.toLowerCase()
    })

    if (!foundTab) {
      dispatch(tabNotFoundInCard({card: foundCard, tabName}))
      return
    }

    dispatch(loadCard({region, cardsPage: foundCardsPage, card: foundCard, tab: foundTab, query}))
  }
}

export function loadCard({region, cardsPage, card, tab, query}) {
  return (dispatch, getState) => {
    dispatch(loadTab({region, cardsPage, card, tab, query}))
  }
}

export function loadTab({region, cardsPage, card, tab, query}) {
  return (dispatch, getState) => {

    const {allRegions} = getState()

    const tabOverrides = (card.tabs || []).find(_tab => _tab.name === tab.name)

    const tabWithConfig = Object.assign({}, tab, tabOverrides)

    dispatch(setCurrentTab({
      region: region,
      card: card,
      tab: tabWithConfig
    }))

    if (query) {
      dispatch(performQuery({
        cardsPage: cardsPage,
        card: card,
        tab: tabWithConfig,
        query
      }))
      return
    }

    // Load up initial query for tab and query
    const tabQuery = Object.assign({}, card.query, {region: region.prefixedCode, year: tabWithConfig.year})

    const getHeaderGroups = apiClient.getHeaderGroups(tabQuery.tableName)

    const maybeAddComparisonRegions = Promise.resolve(tabQuery).then(qry => {
      if (tab.name == 'benchmark') {
        const prefixes = allRegions.filter(isSimilarRegion(region)).map(reg => reg.prefixedCode)
        return Object.assign({}, qry, {
          comparisonRegions: prefixes
        })
      }
      return qry
    })

    Promise
      .all([maybeAddComparisonRegions, getHeaderGroups]).then(([qury, headerGroups]) => {

        const headerGroup = findHeaderGroupForQuery(qury, headerGroups)
        if (!headerGroup) {
          dispatch(noDataForCard({
            region: region,
            cardsPage: cardsPage,
            card: card,
            tab: tabWithConfig
          }))
          return null
        }

        const resolvedQuery = resolveQuery(region, qury, headerGroup, region.config)

        const chart = CHARTS[tabWithConfig.chartKind]

        const querySpec = getQuerySpec(resolvedQuery, {
          tab: tabWithConfig,
          chart,
          headerGroup,
          config: card.config
        })

        const constrained = constrainQuery(resolvedQuery, querySpec, card.config)
        constrained.operations.forEach(op => {
          console.log('[debug] %s: %s ', op.dimension, op.description) // eslint-disable-line no-console
        })
        return constrained.query
      })
      .then(initialQuery => {
        if (initialQuery) {
          dispatch(performQuery({
            region: region,
            cardsPage: cardsPage,
            card: card,
            tab: tabWithConfig,
            query: initialQuery
          }))
        }
      })
  }
}

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
  return (dispatch, getState) => {

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
