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
import once from 'once'

function httpError(error, response) {
  error.code = 'HTTP_ERROR'
  error.response = response
  error.statusCode = response.statusCode
  return error
}

module.exports = defaults({
  headers: {
    accept: 'application/json,text/plain,* / *'
  }
})

export default function defaults(defaultOptions = {}) {

  request.get = function get(url, query, reqOptions) {
    return request(Object.assign({}, {
      method: 'get',
      url: url,
      queryString: query
    }, defaultOptions, reqOptions))
  }
  request.post = function post(url, body, opts) {
    return request(Object.assign({}, {
      method: 'get',
      url: url,
      body: body
    }, defaultOptions, opts))
  }

  return request

  function request(options) {

    if (options.body) {
      options.headers = options.headers || {}
      options.headers['content-type'] = options.headers['content-type'] || 'application/jsoncharset=utf-8'
    }

    const req = performRequest(createRequestOpts(options))

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
    }

    const getPromise = once(() => promisify(req))

    req.then = function then(...args) {
      return getPromise().then(...args)
    }

    req.catch = function catch_(...args) {
      return getPromise().catch(...args)
    }

    req.on('response', function (response) {
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

    req.end()

    return req
  }

  // Turns a duplex (req, res) createRequest into a promise
  function promisify(req) {
    let response
    let buffer = ''
    req.on('response', function (res) {
      response = res
    })
    req.on('data', function (chunk) {
      buffer += chunk
    })

    const PromiseImpl = defaultOptions.promiseImpl || Promise

    return new PromiseImpl(function (resolve, reject) {
      req
        .on('error', reject)
        .on('end', function () {
          resolve({
            body: buffer,
            text: buffer,
            statusCode: response.statusCode,
            statusText: http.STATUS_CODES[response.statusCode],
            headers: response.headers,
            _native: response
          })
        })
    })
  }

  function createRequestOpts(options) {
    const destUrl = Url.parse(options.url, true, true)

    const query = Object.assign({}, options.queryString || {}, destUrl.query)

    const withCredentials = options.hasOwnProperty('withCredentials') ? options.withCredentials :
      (typeof document !== 'undefined' && document.location && document.location.host !== destUrl.host)

    const queryStr = qs.stringify(query)

    return Object.assign({}, {
      method: options.method.toUpperCase(),
      headers: Object.assign(defaultOptions.headers, options.headers || {}),
      path: destUrl.pathname + (queryStr ? '?' + queryStr : ''),
      host: destUrl.host,
      port: destUrl.port,
      protocol: destUrl.protocol,
      withCredentials: withCredentials
    })
  }
}

function performRequest(opts) {
  const proto = opts.protocol == 'https:' ? https : http
  const req = proto.request(opts)
  const duplex = duplexify.obj(req)
  duplex.xhr = req.xhr
  req.on('error', duplex.emit.bind(duplex, 'error'))
  req.on('response', duplex.setReadable.bind(duplex))
  req.on('response', duplex.emit.bind(duplex, 'response'))
  return duplex
}