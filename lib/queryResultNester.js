import {nest} from 'd3'
import {dimensionLabelTitle} from './labels'

export function queryResultNester(result, nesting = []) {
  const _nesting = nesting ? nesting : []
  const nester = nest()
  _nesting.forEach(level => {
    nester.key(item => item[level])
  })

  // Calculate a total for all leaf nodes, to use in maxVal for scaling
  // Also divide the number by 100 if the unit is percent
  let maxVal = 0
  nester.rollup(leaves => {
    leaves.total = 0
    leaves.forEach(leaf => {
      switch (leaf.tabellvariabel) {
        case ':': {
          if (leaf.enhet === 'prosent') {
            // FIXME: Probably not a good idea to have this property be
            // either a string or a number
            leaf.value = '???'
          } else {
            // FIXME: Probably not a good idea to have this property be
            // either a string or a number
            leaf.value = 'Under 5'
          }
          leaf.anonymized = true
          leaf.missingData = false
          break
        }
        case '.': {
          // FIXME: Probably not a good idea to have this property be
          // either a string or a number
          leaf.value = 'Mangler data'
          leaf.anonymized = false
          leaf.missingData = true
          break
        }
        default: {
          leaf.anonymized = false
          leaf.missingData = false
          leaf.value = parseFloat(leaf.tabellvariabel)
          if (leaf.enhet && leaf.enhet === 'prosent') {
            // This is needed because of d3.format('%')
            leaf.value /= 100
          }
          leaves.total += leaf.value
        }
      }
    })
    if (leaves.total > maxVal) {
      maxVal = leaves.total
    }
    return leaves
  })

  const res = nester.entries(result)
  res.maxValue = maxVal
  return res
}

export function nestedQueryResultLabelizer(result, nesting = []) {

  const labelIt = (node, depth = 0) => {
    node.title = dimensionLabelTitle(nesting[depth], node.key)
    if (node.values instanceof Array) {
      node.values.forEach(item => labelIt(item, depth + 1))
    }
  }

  result.forEach(node => labelIt(node))

  return result
}
