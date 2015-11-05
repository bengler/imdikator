import * as regionUtil from './regionUtil'
import humanizeList from 'humanize-list'

const NO_NUMERIC = /\D/
function invalidYear(val) {
  return NO_NUMERIC.test(val)
}

export default function resolveQuery(region, srcQuery, headerGroups, dimensionsConfig = {}) {

  const targetQuery = Object.assign({}, {
    unit: srcQuery.unit,
    region: srcQuery.region,
    tableName: srcQuery.tableName,
    comparisonRegions: srcQuery.comparisonRegions || [],
    dimensions: srcQuery.dimensions.slice()
  })

  const regionHeaderKey = regionUtil.getHeaderKey(region)
  const headerGroupsForRegion = headerGroups.filter(group => group.hasOwnProperty(regionHeaderKey))

  const possibleValues = headerGroupsForRegion.find(headerGroup => {
    return srcQuery.dimensions.every(dim => headerGroup.hasOwnProperty(dim.name))
  })

  if (!possibleValues) {
    const combinationsForHeaderKey = headerGroupsForRegion
      .map(headerGroup => Object.keys(headerGroup).join(', '))
      .map(keys => `[${keys}]`)
    const dimNames = srcQuery.dimensions.map(dim => dim.name)
    throw new Error(
      `Found no header group with values for the combination of [${humanizeList([regionHeaderKey, ...dimNames])}]. `
    + `Possible combinations for ${regionHeaderKey} are ${humanizeList(combinationsForHeaderKey, {conjugation: 'or'})}`
    )
  }

  const {year = []} = srcQuery

  if (typeof year === 'string') {
    if (srcQuery.year === 'latest') {
      targetQuery.year = possibleValues.aar.slice(-1)
    } else if (srcQuery.year === 'all') {
      targetQuery.year = 'all'
    } else {
      throw new Error(`The .year property of a query must be either 'latest', 'all' or an array of years. Got ${JSON.stringify(year)}`)
    }
  } else if (Array.isArray(year)) {
    const invalidYears = year.filter(invalidYear)
    if (invalidYears.length > 0) {
      throw new Error(`Found invalid years in query.year: ${invalidYears.join(', ')}`)
    }
    targetQuery.year = year
  } else {
    throw new Error(`The .year property of a query must be either 'latest', 'all' or an array of years. Got ${JSON.stringify(year)}`)
  }

  targetQuery.dimensions = targetQuery.dimensions.map(dim => {
    const config = dimensionsConfig[dim.name]
    if (config && config.include) {
      return Object.assign({}, dim, {
        variables: config.include
      })
    }
    return dim
  })

  return targetQuery
}
