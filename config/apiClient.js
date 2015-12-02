import * as VismaAPIClient from '../lib/api-client/visma'
import * as EpinovaAPIClient from '../lib/api-client/epinova'
import * as FileAPIClient from '../lib/api-client/files'
import * as APIClient from '../lib/api-client'
import * as JSONConnector from '../lib/http/json'
import config from './index'

export const connector = JSONConnector.defaults({
  headers: {
    'user-agent': 'imdikator:api-client',
    accept: 'application/json,text/plain,* / *'
  }
})

const vismaAPI = VismaAPIClient.create({
  baseUrl: `http://${config.apiHost}/api/v1/`,
  connector: connector
})

const epinovaAPI = EpinovaAPIClient.create({
  baseUrl: `http://${config.contentApiHost}/api/`,
  connector: connector
})

const fileAPI = FileAPIClient.create()

export default APIClient.create({
  vismaAPI: vismaAPI,
  epinovaAPI: epinovaAPI,
  fileAPI: fileAPI
})
