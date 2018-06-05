import { getHeaderKeyNames, prefixify, getRegionTypeFromHeaderKey } from './regionUtil'
import { omit } from 'lodash'
import { CHARTS } from '../config/chartTypes'

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
    if (!row.hasOwnProperty('tabellvariabel')) {
      return row
    }

    const variabel = row.tabellvariabel
    if (variabel === ':') {
      return Object.assign({}, row, {
        formattedValue: 'Skjult',
        anonymized: true,
        value: 4
      })
    } else if (variabel === '.') {
      return Object.assign({}, row, {
        formattedValue: 'Mangler',
        missingData: true,
        value: 0
      })
    }
    return Object.assign({}, row, {
      value: parseFloat(row.tabellvariabel)
    })
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

        const dimensionsConfig = config.dimensions && config.dimensions[queryDim.name]
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

  if (config.chartKind === 'pyramid' && chart.capabilities.dimensions < chartDimensions.length) {
    const first = chartDimensions[0]

    chartDimensions = [first].concat(chartDimensions.slice(-(chart.capabilities.dimensions - 1)))
  } else {
    chartDimensions = chartDimensions.slice(0, chart.capabilities.dimensions)
  }

  // Chart specifics
  if (['stackedArea', 'line'].includes(config.chartKind)) {
    const idx = chartDimensions.indexOf('aar')
    if (idx != -1) {
      chartDimensions.splice(idx, 1)
    }
    chartDimensions.push('aar')
  }

  if (config.chartKind === 'table') {
    if (!chartDimensions.includes('region')) {
      chartDimensions.unshift('region')
    }
    if (!chartDimensions.includes('enhet')) {
      chartDimensions.push('enhet')
    }
  }

  const dimensionsAndVariables = chartDimensions.map(name => {
    const queryDimension = query.dimensions.find(item => item.name === name)
    const variables = queryDimension ? queryDimension.variables : []
    return { name, variables }
  })

  return Object.assign({}, {
    dimensions: dimensionsAndVariables,
    unit: query.unit[0],
    rows: queryRowParser(result).map(normalizeRegionId)
  })
}

