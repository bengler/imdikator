import {regionByPrefixedCode} from './regionUtil'
import {dimensionLabelTitle} from './labels'
import humanizeList from 'humanize-list'

function listify(arr, options = {}) {
  const defaults = {oxfordComma: false, conjunction: 'og'}
  return humanizeList(arr, Object.assign({}, defaults, options))
}

const dict = {
  kjonn0: 'kvinner',
  kjonn1: 'menn',
  kjonn: 'kjønnsfordeling'
}

function languagify(dimension) {
  //console.log('languagify(dimension)', dimension)
  let distribution = dimensionLabelTitle(dimension.name)
  let subject = dimensionLabelTitle(dimension.variables[0])
  if (dimension.name == 'kjonn') {
    distribution = dict.kjonn
    subject = dict[`kjonn${dimension.variables[0]}`]
  }
  return `${distribution} avgrenset til ${subject}`.toLowerCase()
}

export function queryToOptions(query, headerGroup, allRegions) {
  // console.log('query', query)
  // console.log('headerGroup', headerGroup)
  const opts = {}

  // showing
  opts.showing = query.unit

  // regions
  const prefixedRegionCodes = (query.comparisonRegions || [])
  prefixedRegionCodes.unshift(query.region)
  opts.regions = prefixedRegionCodes.map(code => regionByPrefixedCode(code, allRegions).name)

  // timePeriod
  opts.timePeriod = query.year
  if (opts.timePeriod == 'alle') {
    opts.timePeriod = headerGroup.aar
  }
  opts.timePeriod.sort((num1, num2) => {
    return num1 - num2
  })

  // bounds
  opts.bounds = []
  query.dimensions.forEach(dimension => {
    if (dimension.variables.length == 1) {
      opts.bounds.push(languagify(dimension))
    }
  })

  // groupedBy
  opts.groupedBy = []
  query.dimensions.forEach(dimension => {
    if (dimension.variables.length > 1) {
      return dimension.variables.forEach(variable => opts.groupedBy.push(variable))
    }
  })

  return opts
}

// Figuren viser
//   flyktninger
// med
//   aldersfordeling avgrenset til	0-3 år,	kjønnsfordeling	avgrenset til	kvinner	og bakgrunn	avgrenset til	innvandrere,
// fordelt på
//   kjønnsfordeling og befolkningsgrupper
// i (perioden)
//   2014
// fra
//   Sandefjord kommune (Drøbak, Larvik og Bø i Telemark || sammenlignet med lignende enheter)

export function describeChart(options) {
  let result = 'Figuren viser'
  if (options.showing) {
    result = `${result} ${options.showing}`
  }
  if (options.bounds && options.bounds.length > 0) {
    result = `${result} med ${listify(options.bounds)}`
  }
  if (options.groupedBy && options.groupedBy.length > 0) {
    result = `${result} fordelt på ${listify(options.groupedBy)}`
  }
  if (options.timePeriod) {
    const period = options.timePeriod.length == 1 ? options.timePeriod[0] : `perioden ${options.timePeriod[0]} til ${options.timePeriod.slice(-1)}`
    result = `${result} i ${period}`
  }
  if (options.regions) {
    result = `${result} fra ${listify(options.regions)}`
    if (options.comparisonType) {
      result = `${result} sammenlignet med lignende ${options.comparisonType}`
    }
  }
  return result
}
