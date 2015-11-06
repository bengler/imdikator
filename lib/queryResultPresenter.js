import {getHeaderKeyNames, prefixify, getRegionTypeFromHeaderKey} from './regionUtil'
import omit from 'lodash.omit'
import {CHARTS} from '../config/chartTypes'

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

export function queryRowParser(rows) {
  return rows.map(row => {
    if (row.hasOwnProperty('tabellvariabel')) {
      const variabel = row.tabellvariabel
      if (variabel === ':') {
        row.formattedValue = 'Skjult av personvernshensyn'
        row.anonymized = true
        row.value = 4
      } else if (variabel === '.') {
        row.formattedValue = 'Mangler data'
        row.missingData = true
        row.value = 0
      } else {
        row.value = parseFloat(row.tabellvariabel)
      }
    }
    return row
  })
}

export function queryResultPresenter(query, result, config = {}) {
  const dimensionsToRemove = ['tabellvariabel']

  let chartDimensions = []

  chartDimensions = chartDimensions.concat(
    query.dimensions
      .filter(queryDim => {
        if (dimensionsToRemove.includes(queryDim)) {
          return false
        }

        const dimensionsConfig = config.dimensionsConfig && config.dimensionsConfig[queryDim.name]
        const exclude = dimensionsConfig && dimensionsConfig.excludeFromChart
        return !exclude

      })
      .map(dim => dim.name)
  )

  // Regions
  if (query.comparisonRegions && query.comparisonRegions.length > 0) {
    chartDimensions = ['region'].concat(chartDimensions)
  }

  if (query.year === 'alle' || (Array.isArray(query.year) && query.year.length > 1)) {
    chartDimensions = chartDimensions.concat('aar')
  }

  const chart = CHARTS[config.chartKind]

  chartDimensions = chartDimensions.slice(0, chart.capabilities.dimensions)

  // Chart specifics
  if (['stackedArea', 'line'].includes(config.chartKind)) {
    const idx = chartDimensions.indexOf('aar')
    if (idx != -1) {
      chartDimensions.splice(idx, 1)
    }
    chartDimensions.push('aar')
  }


  // todo: see if we can fit this in here somehow
  // if (config.view === 'benchmark') {
  //  chartData.highlight = {
  //    dimensionName: 'region',
  //    value: [region.prefixedCode]
  //  }
  //  sortDirection = 'ascending'
  //}
  return Object.assign({}, {
    dimensions: chartDimensions,
    unit: query.unit[0],
    rows: queryRowParser(result).map(normalizeRegionId)
  })
}
