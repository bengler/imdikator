// Universal [https://medium.com/@mjackson/universal-javascript-4761051b7ae9] request module

// Why not use xhr, request, isomorphic-fetch or other modules?
// - For practical reasons its good to have the same api for doing requests in this code base. That leaves out
//    xhr (not server side)
// - request includes a *lot* of unneccesary bloat as it includes browserify-crypto (which we don't need)
// - Isomorphic-fetch doesn't support streams
// - Usually promises is good enough for most kinds of requests we will need in this application,
//    but some times it is unpractical to buffer the whole response (as promises makes you do), and thus using a stream
//    makes more sense

import http from 'http'
import https from 'https'
import Url from 'url'
import qs from 'qs'
import duplexify from 'duplexify'
import _debug from '../debug'

const debug = _debug.create('http')

function httpError(error, response) {
  error.code = 'HTTP_ERROR'
  error.statusCode = response.statusCode
  return error
}

export const request = defaults({
  headers: {
    accept: 'application/json,text/plain,* / *'
  }
})

export function defaults(defaultOptions = {}) {

  doRequest.get = get
  doRequest.post = post
  function post(url, body, opts) {
    return doRequest(Object.assign({}, {
      method: 'post',
      url: url,
      body: body
    }, defaultOptions, opts))
  }
  function get(url, query, reqOptions) {
    return doRequest(Object.assign({}, {
      method: 'get',
      url: url,
      queryString: query
    }, defaultOptions, reqOptions))
  }
  return doRequest

  function doRequest(options) {
    const body = options.body && (typeof options.body === 'string' ? options.body : JSON.stringify(options.body))

    if (body) {
      options.headers = Object.assign({}, options.headers || {})
      options.headers['content-type'] = options.headers['content-type'] || 'application/json; charset=utf-8'
      options.headers['content-length'] = body.length
    }

    const req = createRequest(prepareRequestOptions(options))

    const promise = promisify(req)
    req.then = promise.then.bind(promise)
    req.catch = promise.catch.bind(promise)

    req.on('response', response => {
      if (response.statusCode >= 300 && response.statusCode < 400) {
        const message = `HTTP Error ${response.statusCode} ${http.STATUS_CODES[response.statusCode]} while`
          + `requesting ${options.url}. `
          + `New url is: ${response.headers.location}`
        const error = new Error(message)
        return req.emit('error', httpError(error, response))
      } else if (response.statusCode < 200 || response.statusCode > 299) {
        const message = `HTTP Error ${response.statusCode} ${http.STATUS_CODES[response.statusCode]} while requesting ${options.url}`
        const error = new Error(message)
        return req.emit('error', httpError(error, response))
      }
    })

    if (body) {
      debug('Post body: %s', body)
      req.write(body)
      req.end()
    } else if (!['post', 'put'].includes(options.method.toLowerCase())) {
      req.end()
    }

    return req
  }

  // Turns a duplex (req, res) createRequest into a promise
  function promisify(req) {
    let response
    let buffer = ''
    let error = false

    req.on('response', res => response = res)
    req.on('data', chunk => buffer += chunk)

    const PromiseImpl = defaultOptions.promiseImpl || Promise

    return new PromiseImpl((resolve, reject) => {
      req
        .on('error', err => {
          error = err
        })
        .on('end', () => {
          const resp = {
            body: buffer,
            text: buffer,
            statusCode: response.statusCode,
            statusText: http.STATUS_CODES[response.statusCode],
            headers: response.headers,
            _native: response
          }
          if (error) {
            return reject(Object.assign(error, {response: resp}))
          }
          resolve(resp)
        })
    })
  }

  function prepareRequestOptions(options) {
    const destUrl = Url.parse(options.url, true, true)

    const query = Object.assign({}, options.queryString || {}, destUrl.query)

    const queryStr = qs.stringify(query)

    return Object.assign({}, {
      method: options.method.toUpperCase(),
      headers: Object.assign({}, defaultOptions.headers, options.headers || {}),
      path: destUrl.pathname + (queryStr ? `?${queryStr}` : ''),
      host: destUrl.host,
      port: destUrl.port,
      protocol: destUrl.protocol,
      withCredentials: options.withCredentials === true
    })
  }
}

function createRequest(options, body) {
  const proto = options.protocol == 'https:' ? https : http

  debug('Performing request: %o', options)

  const req = proto.request(options)

  // Turn the request into a duplex stream, so it gets both readable and writable
  const duplex = duplexify.obj(req)

  // Will only be set if we're in the browser
  duplex.xhr = req.xhr

  req.on('error', duplex.emit.bind(duplex, 'error'))
  req.on('response', duplex.setReadable.bind(duplex))
  req.on('response', duplex.emit.bind(duplex, 'response'))
  req.on('connect', duplex.emit.bind(duplex, 'connect'))
  req.on('socket', duplex.emit.bind(duplex, 'socket'))

  return duplex
}
