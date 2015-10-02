import app from '../app'
import config from '../config'
import pkg from '../package' // eslint-disable-line import/default

const server = app.listen(config.port, function () { // eslint-disable-line prefer-arrow-callback
  const host = server.address().address
  const port = server.address().port
  console.log('%s listening at http://%s:%s', pkg.name, host, port) // eslint-disable-line no-console
})
