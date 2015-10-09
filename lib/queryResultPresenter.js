import {getHeaderKeyForRegionCode} from './regionUtil'
import uniq from 'lodash.uniq'

export function queryResultPresenter(query, result, config) {
  const dimensionsToRemove = ['tabellvariabel']

  let chartDimensions = []

  if (query.year === 'all' || (Array.isArray(query.year) && query.year.length > 1)) {
    chartDimensions = chartDimensions.concat('aar')
  }

  chartDimensions = chartDimensions.concat(
    query.dimensions
      .filter(queryDim => queryDim.visible !== false && !dimensionsToRemove.includes(queryDim))
      .map(dim => dim.name)
  )

  // Chart specifics
  if (config.chartKind === 'line') {
    const idx = chartDimensions.indexOf('aar')
    if (idx != -1) {
      chartDimensions.splice(idx, 1)
      chartDimensions.push('aar')
    }
  }

  // Regions
  if (query.comparisonRegions) {
    const queryRegionHeaderKey = getHeaderKeyForRegionCode(query.region)
    const regionKeys = query.comparisonRegions.map(region => {
      return getHeaderKeyForRegionCode(region)
    })
    chartDimensions = [uniq([queryRegionHeaderKey, ...regionKeys])].concat(chartDimensions)
  }

  return Object.assign({}, {
    dimensions: chartDimensions,
    unit: query.unit,
    rows: result
  })
}
