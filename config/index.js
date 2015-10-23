import defaults from 'defaults'

const env = process.env.NODE_ENV || 'development'

const DEFAULTS = {
  port: 3000,
  reduxDevTools: false
}

export default defaults({
  env,
  port: process.env.PORT,
  reduxDevTools: env == 'development' && !['0', 'false'].includes(process.env.REDUX_DEVTOOLS),
  showDebug: process.env.DEBUG
}, DEFAULTS)
