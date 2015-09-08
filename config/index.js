import defaults from 'defaults'

const DEFAULTS = {
  env: 'development',
  port: 3000,
  reduxDevTools: false
}

export default defaults({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  reduxDevTools: process.env.REDUX_DEVTOOLS !== '0'
}, DEFAULTS)
