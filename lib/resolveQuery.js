import assert from 'assert'
import * as regionUtil from './regionUtil'

export default function resolveQuery(region, srcQuery, headerGroups) {

  const targetQuery = Object.assign({}, {
    unit: srcQuery.unit,
    region: srcQuery.region,
    tableName: srcQuery.tableName,
    dimensions: srcQuery.dimensions.slice()
  })

  const regionHeaderKey = regionUtil.getHeaderKey(region)
  const possibleValues = headerGroups.find(group => {
    return group.hasOwnProperty(regionHeaderKey) && srcQuery.dimensions.every(dim => group.hasOwnProperty(dim.name))
  })
  assert(possibleValues, `No possible values found for region type ${region.type}`)

  if (srcQuery.year) {
    if (srcQuery.year === 'latest') {
      targetQuery.year = possibleValues.aar[possibleValues.aar.length - 1]
    } else if (srcQuery.year === 'all') {
      targetQuery.year = 'all'
    } else if (/\D/.test(srcQuery.year)) {
      throw new Error(`Invalid value for year: ${srcQuery.year}. Must be a valid year or meta values 'latest' or 'all'`)
    } else {
      targetQuery.year = srcQuery.year
    }

  }

  return targetQuery
}
