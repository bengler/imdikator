//import {assert} from 'chai'
import sinon, {assert} from 'sinon'
import * as APIClient from '../../../lib/api-client'

describe('Fetching tables using API client', () => {
  it('can retrieve headers for a given table', () => {
    const stub = sinon.stub().returns(Promise.resolve({json: []}))
    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: {get: stub}
    })

    return client.getHeaderGroups('sometable').then(() => {
      assert.calledWith(stub, 'http://imdikator-st.azurewebsites.net/api/v1/metadata/headergroups/sometable')
    })
  })

  it('can do a basic query', () => {
    const stub = sinon.stub().returns(Promise.resolve({json: []}))

    const client = APIClient.create({
      baseUrl: 'http://imdikator-st.azurewebsites.net/api/v1/',
      adapter: {post: stub}
    })

    const query = {
      tableName: 'introdeltakere',
      region: 'F16',
      year: ['2015'],
      unit: ['prosent'],
      dimensions: [
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
            fylkeNr: ['16'],
            enhet: ['prosent']
          },
          Include: ['kjonn', 'fylkeNr', 'enhet', 'aar']
        })
      })
  })
})
