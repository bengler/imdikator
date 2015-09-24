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

    return client.getHeaderGroups('sometable').then(() => {
        assert.calledWith(stub, 'http://imdikator-st.azurewebsites.net/api/v1/metadata/headergroups/sometable')
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
      region: 'F16',
      dimensions: [
        {name: 'aar', variables: ['2015']},
        {name: 'kjonn', variables: ['0', '1', 'alle']}
      ]
    }

    return client.query(query)
      .then(() => {
        assert.calledWith(stub, 'http://imdikator-st.azurewebsites.net/api/v1/data/query', {
          TableName: query.tableName,
          Conditions: {
            aar: ['2015'],
            kjonn: ['0', '1', 'alle'],
            fylkeId: ['16']
          },
          Include: ['tabellvariabel', 'enhet', 'aar', 'kjonn']
        })
      })
  })
})
