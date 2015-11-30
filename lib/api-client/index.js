import Url from 'url'
import assert from 'assert'
import CARDS_PAGES from '../../data/cardPages'
import CARD_DESCRIPTIONS from '../../data/cardDescriptions'
import MUNICIPALITIES from '../../data/kommuner'
import COUNTIES from '../../data/fylker'
import COMMERCE_REGIONS from '../../data/naeringsregioner'
import BOROUGHS from '../../data/bydeler'
import toVismaQuery from './toVismaQuery'
import indexBy from 'lodash.indexby'
import omit from 'lodash.omit'
import {wrap} from './errors'

const ALL_REGIONS = MUNICIPALITIES.concat(COUNTIES, COMMERCE_REGIONS, BOROUGHS)

const INDEXED_CARD_DESCRIPTIONS = indexBy(CARD_DESCRIPTIONS, 'cardName')
const CARDS_PAGES_WITH_DESCRIPTIONS = CARDS_PAGES.map(cardPage => {
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
  const headerGroupsCache = {}


  return {
    _getTables, // only used by tests for now
    getHeaderGroups,
    query,
    getAllRegions,
    getRegionByCode,
    getCardsPageByName,
    getCardsPages
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
    if (headerGroupsCache[table]) {
      return headerGroupsCache[table]
    }
    headerGroupsCache[table] = _getHeaderGroups(table)
      .catch(error => {
        delete headerGroupsCache[table]
        return Promise.reject(error)
      })
    return headerGroupsCache[table]
  }

  function _getHeaderGroups(table) {
    return Promise.resolve().then(() => {
      const url = Url.format({
        protocol: parsedBaseUrl.protocol,
        host: parsedBaseUrl.host,
        pathname: Url.resolve(parsedBaseUrl.pathname, `metadata/headergroups/${table}`)
      })
      return adapter
        .get(Url.format(url))
        .then(response => response.json)
        .then(sortHeaderGroupVariables)
        .catch(wrapError)
    })
  }

  function sortHeaderGroupVariables(data) {
    data.forEach(group => {
      if (group.aar) {
        group.aar.sort((a, b) => {
          return a < b ? -1 : a > b
        })
      }
    })
    return data
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
        .then(response => response.json.data)
        .catch(wrapError)
    })
  }

  function getAllRegions() {
    return Promise.resolve(ALL_REGIONS)
  }

  function getRegionByCode(regionCode) {
    return getAllRegions().then(allRegions => {
      const matchingRegion = allRegions.find(region => region.prefixedCode.toLowerCase() == regionCode)
      if (!matchingRegion) {
        return Promise.reject(new Error(`Region ${regionCode} not found`))
      }
      return Promise.resolve(matchingRegion)
    })
  }

  function getCardsPageByName(name) {
    return getCardsPages().then(cardsPages => {
      const found = cardsPages.find(group => group.name.toLowerCase() == name.toLowerCase())
      if (!found) {
        return Promise.reject(new Error(`Cards page with name ${name} not found`))
      }
      return found
    })
  }

  function getCardsPages() {
    return Promise.resolve(CARDS_PAGES_WITH_DESCRIPTIONS)
  }
}

function toQueryParams(query) {
  // Todo: validate query

  // This fixes inconsistent key casing in api endpoint
  return upCaseKeys(query)
}
