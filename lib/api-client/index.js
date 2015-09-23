import Url from 'url'
import assert from 'assert'
import MUNICIPALITIES from '../../data/kommuner'
import CARD_PAGES from '../../data/cardPages'
import COUNTIES from '../../data/fylker'
import COMMERCE_REGIONS from '../../data/naeringsregioner'
import toVismaQuery from './toVismaQuery'

export function create({baseUrl, adapter} = {}) {

  assert(baseUrl, 'Missing required option `baseUrl` when calling apiClient.create(...)')
  assert(adapter, 'Missing required option `adapter` when calling apiClient.create(...)')

  const parsedBaseUrl = Url.parse(baseUrl)

  return {
    getTables,
    getHeadersForTable,
    query,
    getRegionByCode,
    getCardPageByName,
    getCardPages
  }

  function getTables() {
    const url = Url.format({
      protocol: parsedBaseUrl.protocol,
      host: parsedBaseUrl.host,
      pathname: Url.resolve(parsedBaseUrl.pathname, 'metadata/tables')
    })
    return adapter.get(Url.format(url)).then(response => response.json)
  }

  function getHeadersForTable(table) {
    const url = Url.format({
      protocol: parsedBaseUrl.protocol,
      host: parsedBaseUrl.host,
      pathname: Url.resolve(parsedBaseUrl.pathname, `metadata/headerswithvalues/${table}`)
    })
    return adapter.get(Url.format(url)).then(response => response.json[0])

  }

  function query(q) {
    const url = Url.format({
      protocol: parsedBaseUrl.protocol,
      host: parsedBaseUrl.host,
      pathname: Url.resolve(parsedBaseUrl.pathname, 'data/query')
    })
    return adapter.post(Url.format(url), toQueryParams(toVismaQuery(q))).then(response => response.json)
  }

  function getRegionByCode(regionCode) {

    const [prefix, code] = [regionCode.substring(0, 1).toLowerCase(), regionCode.substring(1)]

    let found = null
    switch (prefix) {
      case 'k':
        found = Object.assign({type: 'municipality'}, MUNICIPALITIES.find(mun => code == mun.code))
        break
      case 'f':
        found = Object.assign({type: 'county'}, COUNTIES.find(county => code == county.code))
        break
      case 'n':
        found = Object.assign({type: 'commerceRegion'}, COMMERCE_REGIONS.find(region => code == region.code))
        break
      default:
    }

    if (found) {
      return Promise.resolve(found)
    }
    return Promise.reject(new Error(`Region ${regionCode} not found`))
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
