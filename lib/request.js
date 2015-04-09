const xhr = require("xhr");
const url = require("url");
const qs = require("qs");

const defaultOpts = {
  headers: {
    Accept: "application/json,text/plain,* / *"
  }
};

function readContentType(headers) {
  const ctKey = Object.keys(headers).find(h => h.toLowerCase() == 'content-type');
  const contentType = headers[ctKey];
  return contentType && contentType.split(";")[0].trim()
}

function request(options) {

  const requestOpts = Object.assign({}, defaultOpts, {
    method: options.method,
    uri: options.url
  });

  if (options.queryString) {
    const parsedUrl = url.parse(requestOpts.uri, true, true);

    parsedUrl.search = qs.stringify(Object.assign(parsedUrl.query, options.queryString));

    requestOpts.uri = url.format(parsedUrl);
  }

  if (options.body) {
    requestOpts.json = options.body;
  }

  return new Promise((resolve, reject)=> {
    xhr(requestOpts, (err, resp)=> {
      return err ? reject(err) : resolve(resp);
    });
  })
    .then(response => {
      if (readContentType(response.headers) === 'application/json') {
        // Quck and dirty: todo fix upstream in xhr
        response.json = JSON.parse(response.body);
      }
      if (response.statusCode < 200 || response.statusCode > 299) {
        const err = response.json && response.json.error;
        const message = err && err.message || response.body;
        const stack = err && err.stack;
        const error = new Error(`HTTP Error ${response.statusCode}: Internal server error: ${message}.\n${stack ? `Server stack trace: ${stack}` : ""}`);
        error.response = response;
        throw error;
      }
      return response;
    });
}

function post(url, body, options) {
  return request(Object.assign({}, options, {
    method: "POST",
    url: url,
    body: body
  }))
}

function get(url, queryString={}, options={}) {
  return request(Object.assign({}, options, {
    method: "GET",
    url: url,
    queryString: Object.assign(options.queryString || {}, queryString)
  }))
}

request.get = get;
request.post = post;

module.exports = request;