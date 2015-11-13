import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {getQuerySpec, constrainQuery} from '../lib/querySpec'
import {findHeaderGroupForQuery} from '../lib/queryUtil'
import {performQuery} from './query'
import {isSimilarRegion} from '../lib/regionUtil'
import {CHARTS} from '../config/chartTypes'

import {TABS} from '../config/tabs'
import {
} from './ActionTypes'

/** Actions */

export function loadEmbedData({regionCode, cardsPageName, cardName, tabName, query} = {}) {
  return dispatch => {

    requireOption(regionCode, 'regionCode')
    requireOption(cardsPageName, 'cardsPageName')
    requireOption(cardName, 'cardName')
    requireOption(tabName, 'tabName')

    const getRegion = apiClient.getRegionByCode(regionCode.toLowerCase())
    const getCardsPage = apiClient.getCardsPageByName(cardsPageName)

    Promise.all([getRegion, getCardsPage]).then(([region, cardsPage]) => {
      if (!cardName) {
        cardName = cardsPage.cards[0].name
      }

      const foundCard = cardsPage.cards.find(card => card.name == cardName.toLowerCase())

      if (!tabName) {
        tabName = TABS[0].name
      }

      // Tabs are fixed across all, not configured
      const foundTab = TABS.find(tab => tab.name.toLowerCase() == tabName.toLowerCase())

      if (!foundTab) {

        return
      }

      dispatch(loadTab({region, cardsPage: cardsPage, card: foundCard, tab: foundTab, query}))
    })
  }

  function requireOption(value, name) {
    if (!value) {
      throw new Error(`No value for required option ${name}`)
    }
  }
}

export function loadTab({region, cardsPage, card, tab, query}) {
  return (dispatch, getState) => {

    const tabOverrides = (card.tabs || []).find(_tab => _tab.name === tab.name)

    const tabWithConfig = Object.assign({}, tab, tabOverrides)

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
        return apiClient.getAllRegions().then(allRegions => {
          const prefixes = allRegions.filter(isSimilarRegion(region)).map(reg => reg.prefixedCode)
          return Object.assign({}, qry, {
            comparisonRegions: prefixes
          })
        })
      }
      return qry
    })

    Promise
      .all([maybeAddComparisonRegions, getHeaderGroups]).then(([qury, headerGroups]) => {

        const headerGroup = findHeaderGroupForQuery(qury, headerGroups)
        if (!headerGroup) {
          //dispatch(noDataForCard({
          //  region: region,
          //  cardsPage: cardsPage,
          //  card: card,
          //  tab: tabWithConfig
          //}))
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
