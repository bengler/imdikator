function formatVariables(variables) {
  return Array.isArray(variables) ? variables.join(',') : `$${variables}`
}

function stringify(query) {

  const stringified = {
    $u: formatVariables(query.unit),
    $y: formatVariables(query.year)
  }

  if (query.comparisonRegions.length > 0) {
    stringified.$cmp = formatVariables(query.comparisonRegions)
  }

  query.dimensions.forEach(dim => {
    stringified[`${dim.name}`] = formatVariables(dim.variables)
  })

  return Object.keys(stringified).map(key => {
    return `${key}=${stringified[key]}`
  }).join(';')
}

function parseVariables(variables) {
  if (variables.startsWith('$')) {
    return variables.substring(1)
  }
  return variables.split(',')
}

function parseSystemDimension(dimName, variables) {
  switch (dimName) {
    case '$cmp':
      return ['comparisonRegions', parseVariables(variables)]
    case '$y':
      return ['year', parseVariables(variables)]
    case '$u':
      return ['unit', parseVariables(variables)]
    default:
      throw new Error(`Query parse error: Unknown dimension ${dimName}`)
  }
}

function parseDimension(name, value) {
  return [name, value]
}

function parse(queryStr) {
  const dimensions = queryStr.split(';').map(dimension => {
    const [name, variables] = parseDimension(...dimension.split('='))
    return {name, variables}
  })

  const [systemDimensions, otherDimensions] = partition(dimensions, dim => dim.name.startsWith('$'))

  const parsed = {
    dimensions: [],
    comparisonRegions: []
  }

  systemDimensions.forEach(dim => {
    const [name, variables] = parseSystemDimension(dim.name, dim.variables)
    parsed[name] = variables
  })

  otherDimensions.forEach(dim => {
    const [name, variables] = parseDimension(dim.name, dim.variables)
    parsed.dimensions.push({name, variables: parseVariables(variables)})
  })

  return parsed

}


function partition(arr, partitioner) {
  return arr.reduce((acc, item, i) => {
    const idx = partitioner(item, i) ? 0 : 1
    acc[idx].push(item)
    return acc
  }, [[], []])
}


export default {
  stringify,
  parse
}
