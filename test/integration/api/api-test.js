import {assert} from 'chai'
import * as APIClient from '../../../lib/api-client'
import * as json from '../../../lib/http/json'

describe('Fetching tables using API client', () => {
  it('can retrieve all tables', function () {
    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: json
    })

    return client.getTables().then(tables => {
      assert.ok(Array.isArray(tables))
    })
  })

  it('can retrieve headers for a given table', function () {
    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: json
    })

    return client.getTables()
      .then(tables => tables[0])
      .then(tableName => client.getHeadersForTable(tableName))
      .then(assert.ok)
  })

  it('can do a basic query', function () {
    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: json
    })

    // the following curl command works, so why the heck isnt the test passing:
    // curl 'http://imdikator-st.azurewebsites.net/api/v1/data/query' -H 'Content-Type: application/json;charset=UTF-8' --data-binary '{"TableName":"introdeltakere","Conditions":{"aar":["2015"],"kjonn":["0","1","alle"]},"Include":["aar","kjonn"],"Exclude":[]}'
    return client.query({
      tableName: 'introdeltakere',
      conditions: {
        aar: ['2015'],
        kjonn: ['0', '1', 'alle']
      },
      include: ['aar', 'kjonn'],
      exclude: []
    })
      .then(assert.ok)
  })
})
