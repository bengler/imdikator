import {nest, sum} from 'd3'
import {dimensionLabelTitle} from './labels'

export function queryResultNester(result, nesting = []) {
  const _nesting = nesting ? nesting : []
  const nester = nest()
  _nesting.forEach(level => {
    nester.key(item => item[level])
  })

  let maxVal = 0
  nester.rollup(leaves => {
    leaves.total = sum(leaves, item => parseFloat(item.tabellvariabel))
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
