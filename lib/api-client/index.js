import Url from 'url'
import assert from 'assert'
import municipalities from '../../data/kommuner'
import cardPages from '../../data/cardPages'
import counties from '../../data/fylker'
import commerceRegions from '../../data/naeringsregioner'
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
    getCardPageByName
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

    const [prefix, code] = [regionCode.substring(0, 1), regionCode.substring(1)]

    let found = null
    switch (prefix.toLowerCase()) {
      case 'k':
        found = Object.assign({type: 'municipality'}, municipalities.find(mun => code == mun.code))
        break
      case 'f':
        found = Object.assign({type: 'county'}, counties.find(county => code == county.code))
        break
      case 'n':
        found = Object.assign({type: 'commerceRegion'}, commerceRegions.find(region => code == region.code))
        break
      default:
    }

    if (found) {
      return Promise.resolve(found)
    }
    return Promise.reject(new Error(`Region ${regionCode} not found`))
  }

  function getCardPageByName(name) {
    const found = cardPages.find(group => group.name == name)
    if (!found) {
      return Promise.reject(new Error(`Card page with name ${name} not found`))
    }
    return Promise.resolve(found)
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
