import * as APIClient from '../lib/api-client'
import * as json from '../lib/http/json'

export default APIClient.create({
  baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
  adapter: json
})
