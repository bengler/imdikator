import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {getQuerySpec, constrainQuery} from '../lib/querySpec'
import {findHeaderGroupForQuery} from '../lib/queryUtil'
import {isSimilarRegion} from '../lib/regionUtil'
import {setCurrentRegionByCode} from './region'
import {CHARTS} from '../config/chartTypes'
import {prefixifyRegion} from '../lib/regionUtil'

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
  RECEIVE_HEADER_GROUPS
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

    const state = getState()
    const foundCardsPage = state.allCardsPages.find(cardsPage => cardsPage.name.toLowerCase() === cardsPageName.toLowerCase())

    if (!foundCardsPage) {
      dispatch(cardsPageNotFound(foundCardsPage))
      return
    }

    if (state.currentCardsPage !== foundCardsPage) {
      dispatch(setCurrentCardsPage(foundCardsPage))
    }

    // Load header groups for all cards in cardPage
    foundCardsPage.cards.forEach(card => {
      if (!state.headerGroups[card.query.tableName]) {
        dispatch(loadHeaderGroupsForTable(card.query.tableName))
      }
    })

    if (!cardName) {
      return
      //cardName = foundCardsPage.cards[0].name
    }

    dispatch(loadCard({cardName, tabName, query}))
  }
}

export function loadCard({cardName, tabName, query}) {
  return (dispatch, getState) => {

    const {currentCardsPage, currentCard} = getState()

    if (!currentCardsPage) {
      throw new Error('No current cards page')
    }

    const foundCard = cardName && currentCardsPage.cards.find(card => card.name.toLowerCase() === cardName.toLowerCase())

    if (cardName && !foundCard) {
      dispatch(cardNotFoundInPage({cardsPage: currentCardsPage, cardName}))
      return
    }

    if (currentCard !== foundCard) {
      dispatch(setCurrentCard(foundCard))
    }

    if (!tabName) {
      tabName = TABS[0].name
    }

    dispatch(loadTab({tabName, query}))
  }
}

export function loadTab({tabName, query}) {
  return (dispatch, getState) => {

    const {currentCardsPage, currentCard, currentRegion, allRegions} = getState()

    // Tabs are fixed across all, not configured
    const foundTab = TABS.find(tab => {
      return tab.name.toLowerCase() == tabName.toLowerCase()
    })

    if (!foundTab) {
      dispatch(tabNotFoundInCard({card: currentCard, tabName}))
      return
    }

    const tabOverrides = (currentCard.tabs || []).find(tab => tab.name === foundTab.name)

    const tab = Object.assign({}, foundTab, tabOverrides)

    dispatch(setCurrentTab({
      region: currentRegion,
      card: currentCard,
      tab: tab
    }))

    if (query) {
      dispatch(performQuery({
        cardsPage: currentCardsPage,
        card: currentCard,
        tab: tab,
        query
      }))
      return
    }

    // Load up initial query for tab and query

    const tabQuery = Object.assign({}, currentCard.query, {year: foundTab.year})

    const getHeaderGroups = apiClient.getHeaderGroups(tabQuery.tableName)

    const maybeAddComparisonRegions = Promise.resolve(tabQuery).then(qry => {
      if (foundTab.name == 'benchmark') {
        const prefixes = allRegions.filter(isSimilarRegion(currentRegion)).map(reg => reg.prefixedCode)
        return Object.assign({}, qry, {
          comparisonRegions: prefixes
        })
      }
      return qry
    })

    Promise
      .all([maybeAddComparisonRegions, getHeaderGroups]).then(([qury, headerGroups]) => {

        const resolvedQuery = resolveQuery(currentRegion, qury, headerGroups, currentCard.dimensionsConfig)
        const headerGroup = findHeaderGroupForQuery(resolvedQuery, headerGroups)

        const chart = CHARTS[tab.chartKind]

        const querySpec = getQuerySpec(resolvedQuery, {
          tab,
          chart,
          headerGroup,
          dimensionsConfig: currentCard.dimensionsConfig
        })
        return constrainQuery(resolvedQuery, querySpec, currentCard.dimensionsConfig).query

      })
      .then(initialQuery => {
        dispatch(performQuery({
          cardsPage: currentCardsPage,
          card: currentCard,
          tab: tab,
          query: initialQuery
        }))
      })
  }
}

export function performQuery({cardsPage, card, tab, query}) {
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
    const {currentRegion} = getState()

    const newQuery = Object.assign({}, query, {
      region: prefixifyRegion(currentRegion)
    })

    dispatch(requestQueryResult({
      region: currentRegion,
      cardsPage: cardsPage,
      card: card,
      tab: tab,
      query: newQuery
    }))

    const getHeaderGroups = apiClient.getHeaderGroups(query.tableName)
    Promise.all([apiClient.query(newQuery), getHeaderGroups]).then(([queryResult, headerGroups]) => {
      dispatch(receiveQueryResult({
        region: currentRegion,
        cardsPage: cardsPage,
        card: card,
        tab: tab,
        headerGroups: headerGroups,
        query: newQuery,
        queryResult
      }))
    })
  }
}
