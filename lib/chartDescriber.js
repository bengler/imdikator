
import listify from 'listify'

function listme(arr) {
  return listify(arr, {finalWord: 'og'})
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
  if (options.bounds) {
    result = `${result} med ${listme(options.bounds)}`
  }
  if (options.groupedBy) {
    result = `${result} fordelt på ${listme(options.groupedBy)}`
  }
  if (options.timePeriod) {
    const period = options.timePeriod.length == 1 ? options.timePeriod[0] : `perioden ${options.timePeriod[0]} til ${options.timePeriod.slice(-1)}`
    result = `${result} i ${period}`
  }
  if (options.regions) {
    result = `${result} fra ${listme(options.regions)}`
    if (options.comparisonType) {
      result = `${result} sammenlignet med lignende ${options.comparisonType}`
    }
  }
  return result
}
