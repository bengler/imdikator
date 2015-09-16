
export function queryResultPresenter(query, result, config) {
  const dimensions = config.dimensions.map(dim => dim.label)
  const dimensionsToRemove = ['tabellvariabel', 'enhet']

  // Remove year dimension if only one year
  if (query.conditions && query.conditions.aar && query.conditions.aar.length == 1) {
    dimensionsToRemove.push('aar')
  }

  // Remove unwanted dimensions for presentation
  dimensionsToRemove.forEach(unit => {
    const idx = dimensions.indexOf(unit)
    if (idx != -1) {
      dimensions.splice(idx, 1)
    }
  })

  // Chart specifics
  switch (config.chartKind) {
    case 'line': {
      const idx = dimensions.indexOf('aar')
      if (idx != -1) {
        dimensions.splice(idx, 1)
        dimensions.push('aar')
      }
    }
    default: {
    }
  }

  let unit = null
  if (query.conditions && query.conditions.enhet && query.conditions.enhet.length > 0) {
    unit = query.conditions.enhet[0]
  }

  return Object.assign({}, {
    dimensions, unit, rows: result
  })
}
