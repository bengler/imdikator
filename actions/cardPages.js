import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {queryResultPresenter} from '../lib/queryResultPresenter'

export const LOAD_CARD_PAGE = 'LOAD_CARD_PAGE'
export const RECEIVE_CARD_PAGE_DATA = 'RECEIVE_CARD_PAGE_DATA'

import {RECEIVE_QUERY_RESULT} from '../actions/cards'
import {RECEIVE_TABLE_HEADERS} from '../actions/table'

export function loadCardPage({regionCode, pageName, activeCardName, activeTabName}) {
  return dispatch => {
    const getCardPage = apiClient.getCardPageByName(pageName)

    const getRegion = apiClient.getRegionByCode(regionCode)

    const getActiveCard = getCardPage.then(cardPage => {
      return cardPage.cards.find(card => card.name === activeCardName)
    })

    const getHeadersWithValues = getActiveCard.then(activeCard => {
      return apiClient.getHeadersForTable(activeCard.query.tableName)
    })

    const createQuery = Promise.all([getActiveCard, getHeadersWithValues])
      .then(([activeCard, headersWithValues]) => {

        const query = Object.assign({}, activeCard.query)
        query.region = regionCode
        query.time = activeTabName === 'naatid' ? 'latest' : 'latest' // todo: implement this properly

        dispatch({
          type: RECEIVE_TABLE_HEADERS,
          tableName: query.tableName,
          headers: headersWithValues
        })

        return resolveQuery(query, headersWithValues)
      })

    const getQueryResults = createQuery.then(query => {
      return apiClient.query(query)
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
