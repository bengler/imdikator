import defaults from 'defaults'

const API_GLOBAL = '_IMDIKATOR'

const env = process.env.NODE_ENV || 'development'

const DEFAULTS = {
  port: 3000,
  reduxDevTools: false
}

const globalConfig = (typeof window !== 'undefined' && window[API_GLOBAL] || {})

export default defaults({
  env,
  port: process.env.PORT,
  // nodeApiHost: 'localhost:8080',
  nodeApiHost: 'atindikatornode.azurewebsites.net',
  apiHost: globalConfig.apiHost,
  contentApiHost: globalConfig.contentApiHost,
  reduxDevTools: env == 'development' && !['0', 'false'].includes(process.env.REDUX_DEVTOOLS),
  showDebug: process.env.DEBUG
}, DEFAULTS)
