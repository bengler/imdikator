
//
// Normalisation is an attempt to make dimension count
//

import apiClient from '../config/apiClient'
import debug from '../lib/debug'

const populationQuery = {
  tableName: 'befolkning_hovedgruppe',
  unit: 'personer',
  dimensions: [
    {
      name: 'aar',
      variables: ['2014']
    },
    {
      name: 'kommuneNr'
    },
    {
      name: 'innvkat5',
      variables: [
        'alle',
        'innvandrere'
      ]
    },
    {
      name: 'kjonn',
      variables: [
        'alle'
      ]
    }
  ]
}

const refugeeQuery = {
  tableName: 'befolkning_innvandringsgrunn',
  unit: 'personer',
  dimensions: [
    {
      name: 'innvgrunn5',
      variables: [
        'flukt'
      ]
    },
    {
      name: 'aar',
      variables: ['2014']
    },
    {
      name: 'kommuneNr'
    },
    {
      name: 'kjonn',
      variables: [
        'alle'
      ]
    }
  ]
}

apiClient.getAllRegions().then(getData)

function getData(allRegions) {

  const municipalityCodeToNameKeys = { }

  allRegions.filter(region => {
    return region.type == 'municipality'
  }).forEach(municipality => {
    municipalityCodeToNameKeys[municipality.code] = municipality.name
  })

  const populationQueryPromise = apiClient.query(populationQuery)
  const refugeeQueryPromise = apiClient.query(refugeeQuery)
  Promise.all([populationQueryPromise, refugeeQueryPromise]).then(result => {
    findSimilarities(result, municipalityCodeToNameKeys)
  }).catch(debug)
}

function findSimilarities([population, refugees], municipalityCodeToNameKeys) {

  let set = flattenLists(population, refugees)

  // Affix names to each unit
  set.forEach(element => {
    element.name = municipalityCodeToNameKeys[element.kommuneNr]
  })

  // Strip out places that no longer have names
  set = set.filter(element => {
    return element.name
  })

  // Express population sizes as function of total population
  set = set.map(asQuotientOf('immigrants', 'totalPopulation'))
  set = set.map(asQuotientOf('refugees', 'totalPopulation'))

  // Normalize dimension. And add weights.
  normalize(set, 'totalPopulation', 1)
  normalize(set, 'immigrants', 1)
  normalize(set, 'refugees', 1)

  // Biggest go first
  set = set.sort((a, b) => {
    return b.totalPopulation - a.totalPopulation
  })

  // Find similar
  const similarities = calculateProximity(set, ['immigrants', 'refugees', 'totalPopulation'])

  // STATUS HERE
  debug(JSON.stringify(stripDebug(similarities), 0, 2))

}

function stripDebug(set) {
  return set.map(municipality => {
    const similar = municipality.similar.map(sim => {
      return sim.kommuneNr
    })

    return {
      code: municipality.kommuneNr,
      similar: similar
    }
  })
}


// We are batching, so just brute force distances

function calculateProximity(set, fields) {
  return set.map(sourceElement => {
    const annotatedMunicipalities = set.map(destinationElement => {
      return {
        value: findDistance(sourceElement, destinationElement, fields),
        data: destinationElement,
        kommuneNr: destinationElement.kommuneNr
      }
    })

    const rankedMunicipalities = annotatedMunicipalities.sort((a, b) => {
      return (a.value || Infinity) - (b.value || Infinity)
    })

    return {
      kommuneNr: sourceElement.kommuneNr,
      data: sourceElement,
      similar: rankedMunicipalities.slice(0, 15)
    }
  })
}


function findDistance(source, destination, fields) {

  let value = 0

  fields.forEach(field => {
    value += Math.pow(Math.abs(destination[field] - source[field]), 2)
  })


  return Math.sqrt(value)
}


// Divide one field by another

function asQuotientOf(dividend, divisor) {
  return function (element) {
    element[dividend] /= element[divisor]
    return element
  }
}

// Find extents of a value across set and divide by max value. Assumes zero thershold

function normalize(set, variable, modifier) {
  let max = 0
  set.forEach(element => {
    let value = element[variable]
    if (isNaN(value) || !value || value == Infinity) {
      value = 0
    }
    max = Math.max(max, value)
  })

  set.forEach(element => {
    let value = element[variable]
    if (isNaN(value) || !value || value == Infinity) {
      value = 0
    }

    value /= max

    if (modifier) {
      value *= modifier
    }

    element[variable] = value

  })
  debug('Variable max:', variable, max)
}

// Massage data result from API. Excluding

function flattenLists(population, refugees) {
  const result = {}

  refugees.forEach(ref => {
    const kommuneNr = ref.kommuneNr

    result[kommuneNr] = {
      kommuneNr: kommuneNr,
      refugees: ref.tabellvariabel || 0
    }
  })

  population.forEach(ref => {
    const kommuneNr = ref.kommuneNr
    let entry = result[kommuneNr]

    if (!entry) {
      // debug('Could not find refugee count for municipality',kommuneNr)
      result[kommuneNr] = {
        kommuneNr: kommuneNr,
      }
    }

    entry = result[kommuneNr]

    const value = ref.tabellvariabel

    if (ref.innvkat5 == 'innvandrere') {
      entry.immigrants = value || 0
    }

    if (ref.innvkat5 == 'alle') {
      entry.totalPopulation = value || 0
    }
  })

  // Flatten to list
  return Object.values(result)
}
