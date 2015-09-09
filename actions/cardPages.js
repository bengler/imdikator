import apiClient from '../config/apiClient'
import {dimensionLabelTitle} from '../lib/labels'

export const LOAD_CARD_PAGE = 'LOAD_CARD_PAGE'
export const RECEIVE_CARD_PAGE_DATA = 'RECEIVE_CARD_PAGE_DATA'

import {RECEIVE_SAMPLE_DATA} from '../actions/cards'

function makeDefaultQueryFor(card, region, headersWithValues) {

  const query = {
    tableName: card.table,
    conditions: {},
    include: []
  }

  if (region.type === 'municipality') {
    query.conditions.kommuneId = [region.code]
  }

  if (card.time === 'latest') {
    query.conditions.aar = [headersWithValues.uniqueValues.aar[0]]
    query.include.push('aar', 'tabellvariabel', 'enhet')
  }

  card.dimensions.forEach(dimension => {
    query.include.push(dimension.label)
    query.conditions[dimension.label] = dimension.include
  })
  if (card.defaultUnit) {
    query.conditions.enhet = [card.defaultUnit]
  }

  return query
}

export function loadCardPage({regionCode, pageName, activeCardName}) {
  return dispatch => {
    const getCardPage = apiClient.getCardPageByName(pageName)

    const getRegion = apiClient.getRegionByCode(regionCode)

    const getActiveCard = getCardPage.then(cardPage => {
      return cardPage.cards.find(card => card.name === activeCardName)
    })


    const getHeadersWithValues = getActiveCard.then(activeCard => {
      return apiClient.getHeadersForTable(activeCard.table)
    })

    const createQuery = Promise.all([getRegion, getActiveCard, getHeadersWithValues])
      .then(([region, activeCard, headersWithValues]) => {
        return makeDefaultQueryFor(activeCard, region, headersWithValues)
      })

    const getQuery = createQuery.then(query => {
      return apiClient.query(query)
    })

    Promise.all([getCardPage, getRegion, getQuery]).then(([cardPage, region, queryResults]) => {
      dispatch({
        type: RECEIVE_CARD_PAGE_DATA,
        cardPage,
        region,
        queryResults
      })

      const desc = {
        table: 'befolkninghovedgruppe',
        time: 'latest',
        category: {
          name: 'innvkat5',
          values: ['innvandrere', 'bef_u_innv_og_norskf', 'norskfodte_m_innvf'],
          series: {name: 'kjonn', values: ['0', '1']}
        }
      }

      function parseQueryResult(result, config) {
        const parsed = result.map(res => {
          const categoryName = config.category.name
          const category = res[categoryName]

          if (config.category.values.indexOf(category) == -1) {
            return null
          }

          const seriesName = config.category.series.name
          const series = res[seriesName]
          if (config.category.series.values.indexOf(series) == -1) {
            return null
          }

          const value = parseFloat(res.tabellvariabel)

          return {
            category: dimensionLabelTitle(categoryName, category),
            series: dimensionLabelTitle(seriesName, series),
            value
          }
        })

        const nonNullParsed = []
        for (const item of parsed) {
          if (item) {
            nonNullParsed.push(item)
          }
        }
        return {unit: 'persons', data: nonNullParsed}
      }

      dispatch({
        type: RECEIVE_SAMPLE_DATA,
        cardName: activeCardName,
        data: parseQueryResult(queryResults, desc)
      })

    })
  }
}
