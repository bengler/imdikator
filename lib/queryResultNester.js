import {nest, sum} from 'd3'
import {dimensionLabelTitle} from './labels'

export function queryResultNester(result, nesting = []) {
  const _nesting = nesting ? nesting : []
  const nester = nest()
  _nesting.forEach(level => {
    nester.key(item => item[level])
  })

  nester.rollup(leaves => {
    leaves.total = sum(leaves, item => parseFloat(item.tabellvariabel))
    return leaves.total
  })

  const res = nester.entries(result)
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
