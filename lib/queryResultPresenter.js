import {getHeaderKeyNames, prefixify, getRegionTypeFromHeaderKey} from './regionUtil'
import omit from 'lodash.omit'

const HEADER_KEYS = getHeaderKeyNames()

function normalizeRegionId(object) {
  const headerKey = HEADER_KEYS.find(key => object.hasOwnProperty(key))

  const withoutHeaderKeys = omit(object, HEADER_KEYS)

  if (!object.hasOwnProperty(headerKey)) {
    return object
  }

  return Object.assign({}, withoutHeaderKeys, {
    region: prefixify(getRegionTypeFromHeaderKey(headerKey), object[headerKey])
  })

}

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
    chartDimensions = ['region'].concat(chartDimensions)
  }

  return Object.assign({}, {
    dimensions: chartDimensions,
    unit: query.unit,
    rows: result.map(normalizeRegionId)
  })
}
