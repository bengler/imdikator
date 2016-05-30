/**
 * Data wrapper around the api provided by Visma
 */
import Url from 'url'
import assert from 'assert'
import {wrap, httpStatusToErrorCode} from './utils/errors'

function errorMessageFromPayload(payload) {
  if (!payload) {
    return 'Missing error payload'
  }
  return `${payload.message}, details ${payload.messageDetail}`
}

function wrapError(error) {
  const code = httpStatusToErrorCode(error.statusCode)
  const details = {
    message: errorMessageFromPayload(error.json)
  }

  return Promise.reject(wrap(error, code, details))
}

export function create({baseUrl, connector} = {}) {

  assert(baseUrl, 'Missing required option `baseUrl` when calling create(...) in Epinova API Client')
  assert(connector, 'Missing required option `connector` when calling create(...) in Epinova API Client')

  const parsedBaseUrl = Url.parse(baseUrl)

  return {
    getVariableDefinitions,
    getDimensionLabels,
    getCardsDescriptions
  }

  function getVariableDefinitions() {
    return fetchFromEndpoint('indikatorvariabledefinitions')
  }

  function getDimensionLabels() {
    return fetchFromEndpoint('indikatordimensions')
  }

  function getCardsDescriptions() {
    return fetchFromEndpoint('indikatorcarddescriptions')
  }

  function fetchFromEndpoint(endpoint) {
    return Promise.resolve().then(() => {
      const url = Url.format({
        protocol: parsedBaseUrl.protocol,
        host: parsedBaseUrl.host,
        pathname: Url.resolve(parsedBaseUrl.pathname, endpoint)
      })
      return connector
        .get(Url.format(url))
        .then(response => response.json)
        .catch(wrapError)
    })
  }
}
