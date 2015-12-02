import {nest} from 'd3'
import {dimensionLabelTitle} from './labels'

export function queryResultNester(result, nesting = []) {
  const _nesting = nesting ? nesting : []
  const nester = nest()

  _nesting.forEach(level => {
    const variables = level.variables
    const name = level.name
    const keyNest = nester.key(item => item[name])
    if (variables.length > 0) {
      keyNest.sortKeys((a, b) => variables.indexOf(b) - variables.indexOf(a))
    }
  })

  // Calculate a total for all leaf nodes, to use in maxVal for scaling
  // Also divide the number by 100 if the unit is percent
  let maxVal = 0
  nester.rollup(leaves => {
    leaves.total = 0
    leaves.forEach(leaf => {
      leaves.total += leaf.value
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
