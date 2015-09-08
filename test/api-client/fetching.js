//import {assert} from 'chai'
import sinon, {assert} from 'sinon'
import * as APIClient from '../../lib/api-client'

describe('Fetching tables using API client', () => {
  it('can retrieve all tables', function () {

    const stub = sinon.stub().returns(Promise.resolve({json: []}))
    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: {get: stub}
    })

    return client.getTables().then(() => {
      assert.calledWith(stub, 'http://imdikator-st.azurewebsites.net/api/v1/metadata/tables')
    })
  })

  it('can retrieve headers for a given table', function () {
    const stub = sinon.stub().returns(Promise.resolve({json: []}))
    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: {get: stub}
    })

    return client.getHeadersForTable('sometable')
      .then(tables => tables)
      .then(tableName => client.getHeadersForTable(tableName))
      .then(() => {
        assert.calledWith(stub, 'http://imdikator-st.azurewebsites.net/api/v1/metadata/headerswithvalues/sometable')
      })
  })

  it('can do a basic query', function () {
    const stub = sinon.stub().returns(Promise.resolve({json: []}))

    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: {post: stub}
    })

    const query = {
      tableName: 'introdeltakere',
      conditions: {
        aar: ['2015'],
        kjonn: ['0', '1', 'alle']
      },
      include: ['aar', 'kjonn'],
      exclude: []
    }

    return client.query(query)
      .then(() => {
        assert.calledWith(stub, 'http://imdikator-st.azurewebsites.net/api/v1/data/query', {
          TableName: query.tableName,
          Conditions: query.conditions,
          Include: query.include,
          Exclude: query.exclude
        })
      })
  })
})
