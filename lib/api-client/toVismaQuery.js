import assert from 'assert'
import * as regionUtil from '../regionUtil'
import inspect from 'object-inspect'

const REGION_CONDITION_PREFIX_MAP = {
  K: 'kommuneNr',
  N: 'naringsregionNr',
  B: 'bydelNr',
  F: 'fylkeNr'
}
/**
 * Converts a query on the internal app-specific query format to a visma-compliant query format
 */
export default function toVismaQuery(query) {

  const {tableName, dimensions, /* string, i.e. K0101 */ region, unit} = query

  assert(tableName, `Missing 'tableName' in query: ${inspect(query)}`)
  assert(dimensions, `Missing 'dimensions' in query: ${inspect(query)}`)

  const conditions = dimensions.reduce((acc, dim) => {
    if (!dim.variables) {
      return acc
    }
    return Object.assign(acc, {[dim.name]: dim.variables})
  }, {})

  const include = ['enhet'].concat(dimensions.map(dim => dim.name))

  if (region) {
    const [regionPrefix, regionCode] = regionUtil.split(region)

    const regionConditionKey = REGION_CONDITION_PREFIX_MAP[regionPrefix]
    assert(regionConditionKey, `No region key found for region type ${region.type}`)

    conditions[regionConditionKey] = [regionCode]
    include.push(regionConditionKey)
  }

  if (unit) {
    conditions.enhet = [unit]
  }

  return {
    tableName: tableName,
    include: include,
    conditions: conditions
  }
}
