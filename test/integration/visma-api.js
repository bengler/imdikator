import {assert} from 'chai'
import * as APIClient from '../../lib/api-client'
import {adapter, API_URL} from './config'

describe('Fetching tables using API client', () => {
  it('can retrieve all tables', async () => {
    const client = APIClient.create({
      baseUrl: API_URL,
      adapter: adapter
    })

    const tables = await client._getTables()

    return assert(Array.isArray(tables), `Expected visma api to return an array of tables. Instead got ${tables}`)
  })

  it('can retrieve headers for a given table', async () => {
    const client = APIClient.create({
      baseUrl: API_URL,
      adapter: adapter
    })

    const tables = await client._getTables()

    await* tables.map(async tableName => {
      const headerGroups = await client.getHeaderGroups(tableName)
      assert(Object.keys(headerGroups).length > 0, 'Got empty header groups for table ${tableName}')
    })
  })

  it('can do a basic query', async () => {
    const client = APIClient.create({
      baseUrl: API_URL,
      adapter: adapter
    })

    const result = await client.query({
      tableName: 'befolkning_hovedgruppe',
      comparisonRegions: [],
      unit: ['personer'],
      year: ['2015'],
      region: 'K0301',
      dimensions: [
        {name: 'innvkat5', variables: 'all'},
        {name: 'kjonn', variables: ['alle']}
      ]
    })

    assert(Array.isArray(result), 'Expected query to return an array of results')
    assert(result.length > 0, 'Expected query to return at least one result')
  })

  describe('when something goes bad', () => {
    xit('fails with 400 if we query a nonexistent table', async () => {
      const client = APIClient.create({
        baseUrl: API_URL,
        adapter: adapter
      })

      const query = client.query({
        tableName: 'it_would_surprise_me_if_this_table_exists',
        dimensions: [
          {name: 'aar', variables: ['2015']},
          {name: 'kjonn', variables: ['0', '1', 'alle']}
        ]
      })
      try {
        await query
      } catch (error) {
        // Doesn't currently work
        assert.equal(error.code, 'INVALID_API_CALL')
        return
      }
      assert.fail(null, null, "Expected query against a nonexistent table to fail but it didn't")
    })

    it('fails with 400 if an invalid query is passed', async () => {
      const client = APIClient.create({
        baseUrl: API_URL,
        adapter: adapter
      })

      const query = client.query({
        tableName: 'introdeltakere',
        dimensions: [
          {name: 'aar', variables: [['2015']]}, // note the nested array
          {name: 'kjonn', variables: ['0', '1', 'alle']}
        ]
      })
      try {
        await query
      } catch (error) {
        assert.equal(error.code, 'INVALID_API_CALL')
        return
      }
      assert.fail('error', 'success', 'Expected invalid query to fail')
    })
  })
})
