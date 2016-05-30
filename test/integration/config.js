import {defaults} from '../../lib/http/json'
export const connector = defaults({
  headers: {
    'user-agent': 'imdikator:integration-test',
    'accept': 'application/json,text/plain,* / *'
  }
})

export const API_URL = 'http://imdifakta.azurewebsites.net/api/v1/'
