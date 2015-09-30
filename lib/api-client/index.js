import Url from 'url'
import assert from 'assert'
import CARD_PAGES from '../../data/cardPages'
import MUNICIPALITIES from '../../data/kommuner'
import COUNTIES from '../../data/fylker'
import COMMERCE_REGIONS from '../../data/naeringsregioner'
import BOROUGHS from '../../data/bydeler'
import MOCK_DATA from '../../data/mockdata-benchmarkchart'
import toVismaQuery from './toVismaQuery'

const ALL_REGIONS = MUNICIPALITIES.concat(COUNTIES, COMMERCE_REGIONS, BOROUGHS)

export function create({baseUrl, adapter} = {}) {

  assert(baseUrl, 'Missing required option `baseUrl` when calling apiClient.create(...)')
  assert(adapter, 'Missing required option `adapter` when calling apiClient.create(...)')

  const parsedBaseUrl = Url.parse(baseUrl)

  return {
    getTables,
    getHeaderGroups,
    query,
    getAllRegions,
    getRegionByCode,
    getCardPageByName,
    getCardPages,
    getTheData
  }

  function getTables() {
    const url = Url.format({
      protocol: parsedBaseUrl.protocol,
      host: parsedBaseUrl.host,
      pathname: Url.resolve(parsedBaseUrl.pathname, 'metadata/tables')
    })
    return adapter.get(Url.format(url)).then(response => response.json)
  }

  function getHeaderGroups(table) {
    const url = Url.format({
      protocol: parsedBaseUrl.protocol,
      host: parsedBaseUrl.host,
      pathname: Url.resolve(parsedBaseUrl.pathname, `metadata/headergroups/${table}`)
    })
    return adapter.get(Url.format(url)).then(response => response.json)
  }

  function query(q) {
    const url = Url.format({
      protocol: parsedBaseUrl.protocol,
      host: parsedBaseUrl.host,
      pathname: Url.resolve(parsedBaseUrl.pathname, 'data/query')
    })
    return adapter.post(Url.format(url), toQueryParams(toVismaQuery(q))).then(response => response.json)
  }

  function getAllRegions() {
    return Promise.resolve(ALL_REGIONS)
  }

  function getRegionByCode(regionCode) {

    const [prefix, code] = [regionCode.substring(0, 1).toLowerCase(), regionCode.substring(1)]

    let found = null
    switch (prefix) {
      case 'k':
        found = MUNICIPALITIES.find(mun => code == mun.code)
        break
      case 'f':
        found = COUNTIES.find(county => code == county.code)
        break
      case 'b':
        found = BOROUGHS.find(borough => code == borough.code)
        break
      case 'n':
        found = COMMERCE_REGIONS.find(region => code == region.code)
        break
      default:
    }

    if (!found) {
      return Promise.reject(new Error(`Region ${regionCode} not found`))
    }
    return Promise.resolve(found)
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
    return Promise.resolve(CARD_PAGES)
  }

  function getTheData() {
    return Promise.resolve(MOCK_DATA)
  }
}

function toQueryParams(query) {
  // Todo: validate query

  // This fixes inconsistent key casing in api endpoint
  return Object.keys(query).reduce((queryWithCamelCasedKeys, key) => {
    const camelCasedKey = key.substring(0, 1).toUpperCase() + key.substring(1)
    queryWithCamelCasedKeys[camelCasedKey] = query[key]
    return queryWithCamelCasedKeys
  }, {})
}
