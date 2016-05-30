import {regionByPrefixedCode} from './regionUtil'
import {dimensionLabelTitle} from './labels'
import humanizeList from 'humanize-list'
//import util from 'util'
//import _debug from './debug'

function listify(arr, options = {}) {
  const defaults = {oxfordComma: false, conjunction: 'og'}
  return humanizeList(arr, Object.assign({}, defaults, options))
}

function downcaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

// hvilke andre fordleinger har vi?
// Hvertfall:
// vreg3 --> http://localhost:3000/steder/K0301/arbeid/vedvarende-lavinntekt
// botid3 --> http://localhost:3000/steder/K0301/befolkning/flyktning_botid_flytting
const dict = {
  kjonn0: 'kvinner',
  kjonn1: 'menn',
  kjonn: 'kjønnsfordeling',
  bhgalder: 'aldersfordeling'
}


function languagify(dimension) {
  const vars = dimension.variables
  if (vars.length == 1 && vars[0] == 'alle') {
    return null
  }
  // Temporary hack until vars[0] is renamed 'all', at which point the preceding logic will handle this case
  if (dimension.name == 'bhgalder' && vars[0] == '1_5') {
    return null
  }
  let distribution = dimensionLabelTitle(dimension.name)
  let subject = dimensionLabelTitle(dimension.name, vars[0])
  if (dimension.name == 'kjonn') {
    distribution = dict.kjonn
    subject = dict[`kjonn${vars[0]}`]
  }
  if (dimension.name == 'bhgalder') {
    distribution = dict.bhgalder
  }

  return `${downcaseFirstLetter(distribution)} avgrenset til ${subject}`
}


function chartLabel(card, unit) {
  let unitKey = unit
  if (Array.isArray(unit)) {
    unitKey = unit[0]
  }
  if (!card.hasOwnProperty('metadata')) {
    console.log('Missing metadata for card %s', card.name) // eslint-disable-line no-console
    return unitKey
  }

  if (!card.metadata.hasOwnProperty('unitDescriptions')) {
    console.log('Missing unit descriptions for card %s', card.name) // eslint-disable-line no-console
    return unitKey
  }

  if (!card.metadata.unitDescriptions.hasOwnProperty(unitKey)) {
    console.log('Missing unit descriptions for key %s of card %s', unitKey, card.name) // eslint-disable-line no-console
    return unitKey
  }

  return card.metadata.unitDescriptions[unitKey]

}


export function queryToOptions(query, card, headerGroup, allRegions) {
  const opts = {}

  // showing
  opts.showing = chartLabel(card, query.unit)

  // regions
  const prefixedRegionCodes = (query.comparisonRegions || []).slice()
  prefixedRegionCodes.unshift(query.region)
  opts.regions = prefixedRegionCodes.map(code => regionByPrefixedCode(code, allRegions).name)

  // timePeriod
  opts.timePeriod = query.year
  if (opts.timePeriod == 'all') {
    opts.timePeriod = headerGroup.aar.slice()
  }
  opts.timePeriod.sort((num1, num2) => {
    return num1 - num2
  })

  // bounds
  opts.bounds = query.dimensions.map(dimension => {
    if (dimension.variables == 'all') {
      return null
    }
    if (Array.isArray(dimension.variables) && dimension.variables.length == 1) {
      const readableDimension = languagify(dimension)
      if (readableDimension) {
        return readableDimension
      }
    }
    return null
  }).filter(Boolean)


  // groupedBy
  opts.groupedBy = []
  query.dimensions.forEach(dimension => {
    if (!dimension.variables || dimension.variables == 'all') {
      return
    }
    if (dimension.variables.length > 1) {
      opts.groupedBy.push(downcaseFirstLetter(dimensionLabelTitle(dimension.name)))
    }
  })
  return opts
}

// This function returns something along these lines. Beware of various edge cases :)
//
// Figuren viser
//   flyktninger
// med
//   aldersfordeling avgrenset til	0-3 år,	kjønnsfordeling	avgrenset til	kvinner	og bakgrunn	avgrenset til	innvandrere,
// fordelt på
//   kjønnsfordeling og befolkningsgrupper
// i (perioden)
//   2014
// fra
//   Sandefjord kommune (Drøbak, Larvik og Bø i Telemark)
export function describeChart(options) {
  let result = 'Figuren viser'
  if (options.showing) {
    result = `${result} ${options.showing}`
  }
  if (options.bounds && options.bounds.length > 0) {
    result = `${result} med ${listify(options.bounds)}`
  }
  if (options.groupedBy && options.groupedBy.length > 0) {
    result = `${result} fordelt etter ${listify(options.groupedBy)}`
  }
  if (options.timePeriod) {
    const period = options.timePeriod.length == 1 ? options.timePeriod[0] : `perioden ${options.timePeriod[0]} til ${options.timePeriod.slice(-1)}`
    result = `${result} i ${period}`
  }
  if (options.regions) {
    result = `${result} i ${listify(options.regions)}`
  }
  return `${result}.`
}
