import assert from 'assert'
import * as regionUtil from './regionUtil'

const NO_NUMERIC = /\D/
function invalidYear(val) {
  return NO_NUMERIC.test(val)
}

export default function resolveQuery(region, srcQuery, headerGroups) {

  const targetQuery = Object.assign({}, {
    unit: srcQuery.unit,
    region: srcQuery.region,
    tableName: srcQuery.tableName,
    comparisonRegions: srcQuery.comparisonRegions || [],
    dimensions: srcQuery.dimensions.slice()
  })

  const regionHeaderKey = regionUtil.getHeaderKey(region)
  const possibleValues = headerGroups.find(group => {
    return group.hasOwnProperty(regionHeaderKey) && srcQuery.dimensions.every(dim => group.hasOwnProperty(dim.name))
  })
  assert(possibleValues, `No possible values found for region type ${region.type}`)

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
  return targetQuery
}
