import Url from 'url'
import assert from 'assert'
import CARD_PAGES from '../../data/cardPages'
import CARD_DESCRIPTIONS from '../../data/cardDescriptions'
import MUNICIPALITIES from '../../data/kommuner'
import COUNTIES from '../../data/fylker'
import COMMERCE_REGIONS from '../../data/naeringsregioner'
import BOROUGHS from '../../data/bydeler'
import MOCK_DATA from '../../data/mockdata-benchmarkchart'
import toVismaQuery from './toVismaQuery'
import indexBy from 'lodash.indexby'
import omit from 'lodash.omit'
import {wrap} from './errors'

const ALL_REGIONS = MUNICIPALITIES.concat(COUNTIES, COMMERCE_REGIONS, BOROUGHS)

const INDEXED_CARD_DESCRIPTIONS = indexBy(CARD_DESCRIPTIONS, 'cardName')
const CARD_PAGES_WITH_DESCRIPTIONS = CARD_PAGES.map(cardPage => {
  return Object.assign({}, cardPage, {
    cards: cardPage.cards.map(card => {
      return Object.assign({}, card, {
        metadata: omit(INDEXED_CARD_DESCRIPTIONS[card.name], 'cardName')
      })
    })
  })
})

function upCaseKeys(object) {
  return Object.keys(object).reduce((downcased, key) => {
    const downcasedKey = key.substring(0, 1).toUpperCase() + key.substring(1)
    downcased[downcasedKey] = object[key]
    return downcased
  }, {})
}


function mapErrorCode(httpError) {
  if (httpError.statusCode >= 500) {
    return 'SERVER_ERROR'
  }
  if (httpError.statusCode >= 400) {
    return 'INVALID_API_CALL'
  }
  if (httpError.statusCode === 0) {
    return 'CONNECTION_ERROR'
  }
  return 'UNKNOWN_ERROR'
}

function wrapError(error) {
  const code = mapErrorCode(error)

  const details = {
    message: error.json ? error.json.Message : error.stack
  }

  return Promise.reject(wrap(error, code, details))
}

export function create({baseUrl, adapter} = {}) {

  assert(baseUrl, 'Missing required option `baseUrl` when calling apiClient.create(...)')
  assert(adapter, 'Missing required option `adapter` when calling apiClient.create(...)')

  const parsedBaseUrl = Url.parse(baseUrl)

  return {
    _getTables, // only used by tests for now
    getHeaderGroups,
    query,
    getAllRegions,
    getRegionByCode,
    getCardPageByName,
    getCardPages,
    getTheData
  }

  function _getTables() {
    return Promise.resolve().then(() => {
      const url = Url.format({
        protocol: parsedBaseUrl.protocol,
        host: parsedBaseUrl.host,
        pathname: Url.resolve(parsedBaseUrl.pathname, 'metadata/tables')
      })
      return adapter
        .get(Url.format(url))
        .then(response => response.json)
        .catch(wrapError)
    })
  }

  function getHeaderGroups(table) {
    return Promise.resolve().then(() => {
      const url = Url.format({
        protocol: parsedBaseUrl.protocol,
        host: parsedBaseUrl.host,
        pathname: Url.resolve(parsedBaseUrl.pathname, `metadata/headergroups/${table}`)
      })
      return adapter
        .get(Url.format(url))
        .then(response => response.json)
        .catch(wrapError)
    })
  }

  function query(q) {
    return Promise.resolve().then(() => {
      const url = Url.format({
        protocol: parsedBaseUrl.protocol,
        host: parsedBaseUrl.host,
        pathname: Url.resolve(parsedBaseUrl.pathname, 'data/query')
      })
      return adapter
        .post(Url.format(url), toQueryParams(toVismaQuery(q)))
        .then(response => response.json)
        .catch(wrapError)
    })
  }

  function getAllRegions() {
    return Promise.resolve(ALL_REGIONS)
  }

  function getRegionByCode(regionCode) {
    return getAllRegions().then(allRegions => {
      const matchingRegion = allRegions.find(region => region.prefixedCode == regionCode)
      if (!matchingRegion) {
        return Promise.reject(new Error(`Region ${regionCode} not found`))
      }
      return Promise.resolve(matchingRegion)
    })
  }

  function getCardPageByName(name) {
    return getCardPages().then(cardPages => {
      const found = cardPages.find(group => group.name == name)
      if (!found) {
        return Promise.reject(new Error(`Card page with name ${name} not found`))
      }
      return found
    })
  }

  function getCardPages() {
    return Promise.resolve(CARD_PAGES_WITH_DESCRIPTIONS)
  }

  function getTheData() {
    return Promise.resolve(MOCK_DATA)
  }
}

function toQueryParams(query) {
  // Todo: validate query

  // This fixes inconsistent key casing in api endpoint
  return upCaseKeys(query)
}
