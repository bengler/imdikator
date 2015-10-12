import apiClient from '../config/apiClient'
import {prefixifyRegion} from '../lib/regionUtil'
import resolveQuery from '../lib/resolveQuery'
import {queryResultPresenter} from '../lib/queryResultPresenter'
import {REQUEST_CHART_DATA, RECEIVE_CHART_DATA, RECEIVE_TABLE_HEADERS} from './actions'


export function loadChartData(userQuery, options) {
  const queryKey = options.queryKey
  const region = options.region
  const chartKind = options.chartKind

  return (dispatch, getState) => {
    dispatch({
      type: REQUEST_CHART_DATA,
      region: region,
      chartKind: chartKind,
      query: userQuery
    })

    apiClient.getHeaderGroups(userQuery.tableName).then(headerGroups => {
      dispatch({
        type: RECEIVE_TABLE_HEADERS,
        headers: headerGroups,
        tableName: userQuery.tableName
      })
      const newQuery = Object.assign({}, userQuery, {region: prefixifyRegion(region)})

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
        data[queryKey] = queryResultPresenter(resolvedQuery, queryResults, {chartKind})
        dispatch({
          type: RECEIVE_CHART_DATA,
          userQuery: userQuery,
          query: resolvedQuery,
          queryKey: queryKey,
          region: region,
          data: data
        })
      })

    })

  }
}
