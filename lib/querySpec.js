import assert from 'assert'
import {prefixify, getRegionTypeFromHeaderKey} from '../lib/regionUtil'
import difference from 'lodash.difference'
import flatten from 'lodash.flatten'


// Compares contents of two arrays and returns true if values + indexes match
function valuesEqual(value) {
  if (!Array.isArray(value)) {
    return other => value === other
  }
  return other => {
    if (value.length !== other.length) {
      return false
    }
    return value.every((item, i) => item === other[i])
  }
}

export function constrainQuery(query, querySpec, config = {}) {

  // todo: make sure the query adheres to the possible options in query spec, otherwise fix it so it does

  const result = {
    query: Object.assign({}, query),
    operations: []
  }
  const yearSpec = querySpec.find(dim => dim.name == 'year')

  if (query.year === 'all') {
    result.query.year = 'all'
  } else if (!flatten(yearSpec.choices).includes(query.year[0])) {
    result.query.year = yearSpec.choices[0]
    result.operations.push({
      dimension: 'year',
      description: `Vi har ikke data for år ${query.year}. Erstattet med ${yearSpec.choices[0]}`
    })
  }

  const unitSpec = querySpec.find(dim => dim.name == 'unit')
  if (!unitSpec.choices.some(valuesEqual(query.unit))) {
    result.query.unit = unitSpec.choices[0]
    result.operations.push({
      dimension: 'unit',
      description: `Ikke mulig å velge enhet ${query.unit}. Erstattet med ${unitSpec.choices[0]}`
    })
  }

  const comparisonRegionsSpec = querySpec.find(dim => dim.name == 'comparisonRegions')
  const invalidRegions = query.comparisonRegions.filter(cmpRegionCode => {
    return !comparisonRegionsSpec.choices.some(regCode => regCode == cmpRegionCode)
  })

  if (invalidRegions.length > 0) {
    result.query.comparisonRegions = difference(query.comparisonRegions, invalidRegions)
    result.operations.push({
      dimension: 'comparisonRegions',
      description: `Ikke mulig å velge regionene ${invalidRegions.join(', ')}.`
    })
  }

  result.query.dimensions = query.dimensions
    .map(queryDim => {

      const dimFromSpec = querySpec.find(specDim => queryDim.name === specDim.name)
      if (!dimFromSpec) {
        result.operations.push({
          dimension: queryDim.name,
          description: `Ugyldig dimensjon: "${queryDim.name}"`
        })
        return null
      }
      if (dimFromSpec.locked) {
        return Object.assign({}, queryDim, {variables: 'all'})
      }
      if (queryDim.variables == 'all') {
        return queryDim
      }

      if (queryDim.variables && !dimFromSpec.choices.some(valuesEqual(queryDim.variables))) {
        let replaceWith = dimFromSpec.choices.find(dim => dim[0] === 'alle')
        if (!replaceWith) {
          replaceWith = Array.isArray(dimFromSpec.choices[0]) ? dimFromSpec.choices[0] : [dimFromSpec.choices[0]]
        }
        result.operations.push({
          dimension: queryDim.name,
          description: `Ugyldig verdi ${
            JSON.stringify(queryDim.variables)
            }. Må være en av ${
            JSON.stringify(dimFromSpec.choices.join(', '))
            }. Erstatter med ${JSON.stringify(replaceWith)}`
        })
        return Object.assign({}, queryDim, {
          variables: replaceWith
        })
      }
      return queryDim
    })
    .filter(Boolean)
    .map(queryDim => {
      // Filter out dimension variables that are explicitly configured to be included/excluded
      const dimensionsConfig = config[queryDim.name] || {}
      return includeVariables(queryDim, dimensionsConfig)
    })

  return result

  function includeVariables(dimension, {include}) {
    if (!include) {
      return dimension
    }
    if (dimension.variables === 'all') {
      return Object.assign({}, dimension, {
        variables: include
      })
    }
    const kept = dimension.variables.filter(val => val === 'alle' || include.includes(val))
    const rejected = difference(dimension.variables, kept)
    if (rejected.length == 0) {
      return dimension
    }
    result.operations.push({
      dimension: dimension.name,
      description: `Fjernet ${rejected.join(', ')} fra ${dimension.name} basert på konfigurasjon`
    })
    return Object.assign({}, dimension, {
      variables: kept
    })
  }
}

export function getQuerySpec(query, {tab, headerGroup, chart, dimensionsConfig = {}}) {

  const validRegions = ['kommuneNr', 'fylkeNr', 'bydelNr', 'naringsregionNr'].reduce((acc, headerKey) => {
    if (!headerGroup.hasOwnProperty(headerKey)) {
      return acc
    }

    const regionType = getRegionTypeFromHeaderKey(headerKey)
    return acc.concat(headerGroup[headerKey].map(regionCode => prefixify(regionType, regionCode)))
  }, [])

  const comparisonRegions = {
    name: 'comparisonRegions',
    fixed: true,
    hidden: (dimensionsConfig.comparisonRegions || {}).hidden === true,
    locked: tab.name === 'benchmark',
    choices: validRegions
  }
  const year = {
    name: 'year',
    fixed: true,
    hidden: (dimensionsConfig.year || {}).hidden === true,
    locked: tab.name === 'chronological',
    choices: tab.name === 'chronological' ? ['all'] : headerGroup.aar.map(y => [y])
  }
  const unit = {
    name: 'unit',
    fixed: true,
    hidden: (dimensionsConfig.unit || {}).hidden === true,
    locked: false,
    choices: headerGroup.enhet.map(un => [un])
  }

  let availDimensions = chart.capabilities.dimensions
  if (query.comparisonRegions.length > 0) {
    availDimensions--
  }

  if (query.year.length > 1 && query.year !== 'all') {
    availDimensions--
  }

  const freeDimensions = query.dimensions.map(chart.name === 'pyramid' ? transformPyramidChartDimensions : transformDefaultChartDimensions)

  return [comparisonRegions, year, ...freeDimensions, unit]

  function transformPyramidChartDimensions(dimension, i) {

    const config = dimensionsConfig[dimension.name] || {}
    const excludeFromChart = config.excludeFromChart === true
    const possibleValues = config.include || headerGroup[dimension.name]

    assert(possibleValues, `Dimension ${dimension.name} included in query, but no possible values for it found in headerGroup`)

    const constrained = availDimensions <= 0
    let hidden = false

    let locked = true

    const isOnFirstFreeDimension = i === 0

    // If headergroup for dimension does not contain 'alle' ->
    let choices = dimension.variables ? [dimension.variables] : []

    if (isOnFirstFreeDimension) {
      if (availDimensions == 2) {
        choices = possibleValues.map(val => [val])
        locked = false
      } else {
        choices = dimension.variables ? [dimension.variables] : []
      }
    } else {
      hidden = true
    }

    if (!excludeFromChart) {
      availDimensions--
    }
    return {
      locked,
      hidden: hidden,
      constrained: constrained,
      name: dimension.name,
      choices
    }
  }

  function transformDefaultChartDimensions(dimension, i) {

    const config = dimensionsConfig[dimension.name] || {}
    const excludeFromChart = config.excludeFromChart === true
    const possibleValues = config.include || headerGroup[dimension.name]

    assert(possibleValues, `Dimension ${dimension.name} included in query, but no possible values for it found in headerGroup`)

    const possibleAggregateValue = possibleValues.find(val => val === 'alle')
    const possibleValuesWithoutAggregate = possibleValues.filter(val => val != possibleAggregateValue)

    const locked = i == 0 && availDimensions > 0
    const constrained = availDimensions <= 0

    // If headergroup for dimension does not contain 'alle' ->
    let choices
    if (locked) {
      // Perhaps there are others reasons something is disabled. Right now only reason is that the user can't change it
      // The only possible choice is to show aggregation of all dimension variables
      choices = dimension.variables ? [dimension.variables] : []
    } else if (availDimensions > 0) {
      // The dimension can be expanded
      choices = possibleAggregateValue ? [[possibleAggregateValue], possibleValuesWithoutAggregate] : [possibleValuesWithoutAggregate]
    } else {
      // the user need to choose amongst the possible variables (it is constrained)
      choices = possibleValues.map(val => [val])
    }
    if (!excludeFromChart) {
      availDimensions--
    }
    return {
      locked,
      hidden: config.hidden === true,
      constrained: constrained,
      name: dimension.name,
      choices
    }
  }

}
