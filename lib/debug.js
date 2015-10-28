import config from '../config'

if (typeof window !== 'undefined' && window.localStorage) {
  window.localStorage.debug = config.showDebug
}

// Needs to be require()-d because window.localStorage.debug must be set before debug is loaded
const Debug = require('debug') // eslint-disable-line import/no-require

const PREFIX = 'imdikator'

function create(prefix) {
  return Debug([PREFIX, prefix].filter(Boolean).join('-'))
}

const debug = create()
debug.create = create


export default debug
