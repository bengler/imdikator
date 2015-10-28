import * as APIClient from '../lib/api-client'
import {defaults} from '../lib/http/json'

export const adapter = defaults({
  headers: {
    'user-agent': 'imdikator:api-client',
    accept: 'application/json,text/plain,* / *'
  }
})

export default APIClient.create({
  baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
  adapter: adapter
})
