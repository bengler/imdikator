import apiClient from '../config/apiClient'
import {prefixify} from '../lib/regionUtil'
import resolveQuery from '../lib/resolveQuery'
import {queryResultPresenter} from '../lib/queryResultPresenter'
import {REQUEST_CHART_DATA, RECEIVE_CHART_DATA, RECEIVE_TABLE_HEADERS} from './actions'


export function loadChartData(region, userQuery, chartKind) {
  return (dispatch, getState) => {
    dispatch({
      type: REQUEST_CHART_DATA,
      query: userQuery
    })

    apiClient.getHeaderGroups(userQuery.tableName).then(headerGroups => {
      dispatch({
        type: RECEIVE_TABLE_HEADERS,
        headers: headerGroups,
        tableName: userQuery.tableName
      })
      const newQuery = Object.assign({}, userQuery, {region: prefixify(region)})

      let resolvedQuery
      try {
        resolvedQuery = resolveQuery(region, newQuery, headerGroups)
      } catch (err) {
        if (err.name == 'AssertionError') {
          return null
        }
      }

      apiClient.query(resolvedQuery).then(queryResults => {
        const data = {}
        data[userQuery.tableName] = queryResultPresenter(resolvedQuery, queryResults, {chartKind})
        dispatch({
          type: RECEIVE_CHART_DATA,
          userQuery: userQuery,
          query: resolvedQuery,
          data: data
        })
      })

    })

  }
}
