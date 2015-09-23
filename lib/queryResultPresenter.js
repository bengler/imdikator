
export function queryResultPresenter(query, result, config) {
  const dimensionsToRemove = ['tabellvariabel', 'enhet']
  // Remove year dimension if only one year
  if (query.dimensions && query.dimensions.some(dim => dim.name == 'aar' && dim.variables && dim.variables.length == 1)) {
    dimensionsToRemove.push('aar')
  }

  const dimensions = (query.dimensions || []).filter(dim => {
    if (dim.hasOwnProperty('visible') && dim.visible === false) {
      return false
    }
    return !dimensionsToRemove.includes(dim.name)
  }).map(dim => dim.name)

  // Chart specifics
  if (config.chartKind === 'line') {
    const idx = dimensions.indexOf('aar')
    if (idx != -1) {
      dimensions.splice(idx, 1)
      dimensions.push('aar')
    }
  }

  const presentation = Object.assign({}, {
    dimensions,
    unit: query.unit,
    rows: result
  })

  return presentation
}
