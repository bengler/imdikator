import {defaults} from '../../lib/http/json'
export const adapter = defaults({
  headers: {
    'user-agent': 'imdikator:integration-test',
    accept: 'application/json,text/plain,* / *'
  }
})

export const API_URL = 'http://imdikator-st.azurewebsites.net/api/v1/'
