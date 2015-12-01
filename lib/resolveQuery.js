const NO_NUMERIC = /\D/
function invalidYear(val) {
  return NO_NUMERIC.test(val)
}

export default function resolveQuery(region, srcQuery, headerGroup, dimensionsConfig = {}) {
  const targetQuery = Object.assign({}, {
    unit: srcQuery.unit,
    region: region.prefixedCode,
    tableName: srcQuery.tableName,
    comparisonRegions: srcQuery.comparisonRegions || [],
    dimensions: srcQuery.dimensions.slice()
  })

  const {year = []} = srcQuery

  if (typeof year === 'string') {
    if (srcQuery.year === 'latest') {
      targetQuery.year = headerGroup.aar.slice(-1)
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
    if (config && config.include && (dim.variables === 'all' || !dim.variables)) {
      return Object.assign({}, dim, {
        variables: config.include
      })
    } else if (dim.variables === 'all' || !dim.variables) {
      return Object.assign({}, dim, {
        variables: headerGroup[dim.name]
      })
    }
    return dim
  })

  return targetQuery
}
