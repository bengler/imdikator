import apiClient from '../config/apiClient'
import resolveQuery from '../lib/resolveQuery'
import {findHeaderGroupForQuery} from '../lib/queryUtil'
import {isSimilarRegion} from '../lib/regionUtil'
import {REQUEST_REGION_SUMMARY_DATA, RECEIVE_REGION_SUMMARY_DATA, NO_SUMMARY_DATA} from './ActionTypes'

function requestSummaryData({region, summaryConfig}) {
  return {
    type: REQUEST_REGION_SUMMARY_DATA,
    region: region,
    summaryConfig: summaryConfig
  }
}

function receiveSummaryData({region, summaryConfig, query, queryResult}) {
  return {
    type: RECEIVE_REGION_SUMMARY_DATA,
    region: region,
    summaryConfig: summaryConfig,
    query: query,
    queryResult: queryResult
  }
}

function noSummaryData({region, summaryConfig}) {
  return {
    type: NO_SUMMARY_DATA,
    region: region,
    summaryConfig: summaryConfig
  }
}

export function loadRegionSummaryDataForRegion(region, summaryConfig) {
  return (dispatch, getState) => {

    const state = getState()

    if ((state.regionSummaries[region.prefixedCode] || {})[summaryConfig.name]) {
      // we got it already
      return
    }

    const {allRegions} = state

    dispatch(requestSummaryData({region, summaryConfig}))

    apiClient.getHeaderGroups(summaryConfig.query.tableName).then(headerGroups => {

      const query = extendQuery(summaryConfig)

      const headerGroup = findHeaderGroupForQuery(query, headerGroups)
      if (!headerGroup) {
        dispatch(noSummaryData({
          region,
          summaryConfig
        }))
        return
      }

      const resolvedQuery = resolveQuery(region, extendQuery(summaryConfig), headerGroup)

      apiClient.query(resolvedQuery).then(queryResult => {
        dispatch(receiveSummaryData({
          region,
          summaryConfig,
          query: resolvedQuery,
          queryResult
        }))
      })

    })

    function extendQuery(summary) {
      // extend the configured query with region and comparison regions
      const comparisonRegions = summary.compareWithSimilarRegions ? allRegions.filter(isSimilarRegion(region)) : []
      return Object.assign({}, summary.query, {
        region: region.prefixedCode,
        comparisonRegions: comparisonRegions.map(reg => reg.prefixedCode)
      })
    }
  }
}
