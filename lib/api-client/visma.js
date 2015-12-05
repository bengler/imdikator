/**
 * Data wrapper around the api provided by Visma
 */
import Url from 'url'
import assert from 'assert'
import toVismaQuery from './utils/toVismaQuery'
import toVismaCompareQuery from './utils/toVismaCompareQuery'
import {wrap, httpStatusToErrorCode} from './utils/errors'

function wrapError(error) {
  const code = httpStatusToErrorCode(error.statusCode)
  const details = {
    message: error.json ? error.json.Message : error.stack
  }

  return Promise.reject(wrap(error, code, details))
}

function upCaseKeys(object) {
  return Object.keys(object).reduce((downcased, key) => {
    const downcasedKey = key.substring(0, 1).toUpperCase() + key.substring(1)
    downcased[downcasedKey] = object[key]
    return downcased
  }, {})
}

function sortHeaderGroupVariable(variable, sortFn) {
  return headerGroups => {
    return headerGroups.map(headerGroup => {
      if (!headerGroup[variable]) {
        return headerGroup
      }
      return Object.assign({}, headerGroup, {
        [variable]: headerGroup[variable].slice().sort(sortFn)
      })
    })
  }
}

export function create({baseUrl, connector} = {}) {

  assert(baseUrl, 'Missing required option `baseUrl` when calling create(...) in Visma API Client')
  assert(connector, 'Missing required option `connector` when calling create(...) in Visma API Client')

  const parsedBaseUrl = Url.parse(baseUrl)
  const headerGroupsCache = {}

  return {
    _getTables, // only used by tests for now
    getHeaderGroups,
    query
  }

  function _getTables() {
    return Promise.resolve().then(() => {
      const url = Url.format({
        protocol: parsedBaseUrl.protocol,
        host: parsedBaseUrl.host,
        pathname: Url.resolve(parsedBaseUrl.pathname, 'metadata/tables')
      })
      return connector
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
      return connector
        .get(Url.format(url))
        .then(response => response.json)
        .then(sortHeaderGroupVariable('aar', (year, otherYear) => Number(year) - Number(otherYear)))
        .catch(wrapError)
    })
  }

  function query(q) {
    if ((q.comparisonRegions || []).length > 0) {
      return continuedQueryVisma('data/compare', toVismaCompareQuery(q)).then(res => {
        console.log('data', res)
        return res
      })
    }
    // TODO: Move over to data/compare for all queries
    return continuedQueryVisma('data/query', toVismaQuery(q))
  }

  function continuedQueryVisma(endpoint, vismaQuery, continuationToken) {

    return queryVisma(endpoint, vismaQuery, continuationToken).then(response => {

      const {continuation:newContinuationToken, data} = response
      if (!newContinuationToken) {
        return data
      }

      return continuedQueryVisma(endpoint, vismaQuery, newContinuationToken).then(nextResult => {
        return data.concat(nextResult)
      })

    })
  }

  function queryVisma(endpoint, vismaQuery, continuationToken) {
    return Promise.resolve().then(() => {
      const url = Url.format({
        protocol: parsedBaseUrl.protocol,
        host: parsedBaseUrl.host,
        pathname: Url.resolve(parsedBaseUrl.pathname, endpoint)
      })

      vismaQuery = Object.assign({}, toQueryParams(vismaQuery))

      if (continuationToken) {
        vismaQuery.continuation = continuationToken
      }

      console.info("My query", vismaQuery)

      return connector
        .post(Url.format(url), vismaQuery)
        .then(response => response.json)
        .catch(wrapError)
    })
  }
}

function toQueryParams(query) {
  // Todo: validate query

  // This fixes inconsistent key casing in api endpoint
  return upCaseKeys(query)
}
