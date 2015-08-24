import defaults from 'defaults'

const DEFAULTS = {
  env: 'development',
  port: 3000
}

export default defaults({
  env: process.env.NODE_ENV,
  port: process.env.PORT
}, DEFAULTS)
