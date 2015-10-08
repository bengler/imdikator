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
  const possibleValues = headerGroups.find(group => group.hasOwnProperty(regionHeaderKey))
  assert(possibleValues, `No possible values found for region type ${region.type}`)

  if (srcQuery.year) {
    targetQuery.year = srcQuery.year === 'latest' ? possibleValues.aar[possibleValues.aar.length - 1] : srcQuery.year
  }

  return targetQuery
}
