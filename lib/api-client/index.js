import json from '../http/json'
import Url from 'url'
import qs from 'qs'
import assert from 'assert'

export function create({baseUrl, adapter} = {}) {

  assert(baseUrl, 'Missing required option `baseUrl` when calling apiClient.create(...)')
  assert(adapter, 'Missing required option `adapter` when calling apiClient.create(...)')

  const parsedBaseUrl = Url.parse(baseUrl)

  return {
    getTables,
    getHeadersForTable,
    query
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
    return adapter.get(Url.format(url)).then(response => response.json)

  }

  function query(q) {
    const url = Url.format({
      protocol: parsedBaseUrl.protocol,
      host: parsedBaseUrl.host,
      pathname: Url.resolve(parsedBaseUrl.pathname, 'data/query')
    })
    return adapter.post(Url.format(url), toQueryParams(q)).then(response => response.json)
  }
}

function toQueryParams(query) {
  // Todo: validate query
  return query
}
