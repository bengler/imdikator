// Todo: turn this into a separate module

// Why not use xhr, request, isomorphic-fetch or other modules?
// - For practical reasons its good to have the same api for doing requests in this code base. That leaves out
//    xhr (not server side)
// - request includes a *lot* of unneccesary bloat as it includes browserify-crypto (which we don't need)
// - Isomorphic-fetch doesn't support streams
// - Usually promises is good enough for most kinds of requests we will need in this application,
//    but some times it is unpractical to buffer the whole response (as promises makes you do), and thus using a stream
//    makes more sense

const http = require("http");
const https = require("https");
const url = require("url");
const extend = require("xtend");
const qs = require("qs");
const duplexify = require("duplexify");
const once = require("once");

function httpError(error, response) {
  error.code = "HTTP_ERROR";
  error.response = response;
  error.statusCode = response.statusCode;
  return error;
}

module.exports = defaults({
  headers: {
    accept: "application/json,text/plain,* / *"
  }
});

module.exports.defaults = defaults;

function defaults(defaults = {}) {

  request.get = function get(url, query, opts) {
    return request(Object.assign({}, {
      method: 'get',
      url: url,
      queryString: query
    }, opts))
  };
  request.post = function post(url, body, opts) {
    return request(Object.assign({}, {
      method: 'get',
      url: url,
      body: body
    }, opts))
  };

  return request;

  function request(options) {

    if (options.body) {
      options.headers = options.headers || {};
      options.headers['content-type'] = options.headers['content-type'] || "application/json;charset=utf-8";
    }

    const persistent = duplexify();

    const request = performRequest(createRequestOpts(options));

    if (options.body) {
      request.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    const getPromise = once(()=> promisify(request))

    request.then = function then(...args) {
      return getPromise().then(...args);
    };

    request.catch = function catch_(...args) {
      return getPromise().catch(...args);
    };

    request.on('response', function(response) {
      if (response.statusCode >= 300 && response.statusCode < 400) {
        const message = `HTTP Error ${response.statusCode} ${http.STATUS_CODES[response.statusCode]} while`
          + `requesting ${options.url}. `
          + `New url is: ${response.headers.location}`;
        const error = new Error(message)
        return request.emit('error', httpError(error, response));
      }
      else if (response.statusCode < 200 || response.statusCode > 299) {
        const message = `HTTP Error ${response.statusCode} ${http.STATUS_CODES[response.statusCode]} while requesting ${options.url}`
        const error = new Error(message)
        return request.emit('error', httpError(error, response));
      }
    });

    request.end();

    return request
  }

  // Turns a duplex (req, res) createRequest into a promise
  function promisify(req) {
    let response;
    let buffer = '';
    req.on('response', function (res) {
      response = res;
    });
    req.on('data', function (chunk) {
      buffer += chunk;
    });

    const PromiseImpl = defaults.promiseImpl || Promise;

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
          });
        });
    });
  }

  function createRequestOpts(options) {
    const destUrl = url.parse(options.url, true, true);

    const query = Object.assign({}, options.queryString || {}, destUrl.query);

    const withCredentials = options.hasOwnProperty('withCredentials') ? options.withCredentials :
      (typeof document !== 'undefined' && document.location && document.location.host !== destUrl.host);

    const queryStr = qs.stringify(query);

    return extend({}, {
      method: options.method.toUpperCase(),
      headers: extend(defaults.headers, options.headers || {}),
      path: destUrl.pathname + (queryStr ? '?'+queryStr : ''),
      host: destUrl.host,
      port: destUrl.port,
      protocol: destUrl.protocol,
      withCredentials: withCredentials
    });
  }
};

function performRequest(opts) {
  const proto = opts.protocol == 'https:' ? https : http;
  const req = proto.request(opts);
  const duplex = duplexify.obj(req);
  duplex.xhr = req.xhr;
  req.on('error', duplex.emit.bind(duplex, 'error'));
  req.on('response', duplex.setReadable.bind(duplex));
  req.on('response', duplex.emit.bind(duplex, 'response'));
  return duplex;
}