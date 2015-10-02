import apiClient from '../config/apiClient'
import {prefixify} from '../lib/regionUtil'
import resolveQuery from '../lib/resolveQuery'
import {queryResultPresenter} from '../lib/queryResultPresenter'

export const REQUEST_CHART_DATA = 'REQUEST_CHART_DATA'
export const RECEIVE_CHART_DATA = 'RECEIVE_CHART_DATA'

export function loadChartData(region, userQuery, chartKind) {
  return (dispatch, getState) => {
    dispatch({
      type: REQUEST_CHART_DATA,
      query: userQuery
    })

    apiClient.getHeaderGroups(userQuery.tableName).then(headerGroups => {
      const newQuery = Object.assign({}, userQuery, {region: prefixify(region)})
      const resolvedQuery = resolveQuery(region, newQuery, headerGroups)

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
