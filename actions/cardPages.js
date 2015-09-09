import apiClient from '../config/apiClient'
import {queryResultNester, nestedQueryResultLabelizer} from '../lib/queryResultNester'

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
        region
      })

      const nesting = ['innvkat5', 'kjonn']
      const parsed = queryResultNester(queryResults, nesting)

      dispatch({
        type: RECEIVE_SAMPLE_DATA,
        cardName: activeCardName,
        data: {unit: 'persons', data: nestedQueryResultLabelizer(parsed, nesting)}
      })
    })
  }
}
