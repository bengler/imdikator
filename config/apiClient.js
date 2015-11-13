import * as APIClient from '../lib/api-client'
import {defaults} from '../lib/http/json'
import config from './index'

export const adapter = defaults({
  headers: {
    'user-agent': 'imdikator:api-client',
    accept: 'application/json,text/plain,* / *'
  }
})

export default APIClient.create({
  baseUrl: `http://${config.apiHost}/api/v1/`,
  adapter: adapter
})
