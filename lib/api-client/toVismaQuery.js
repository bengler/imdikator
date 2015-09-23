import assert from 'assert'
import * as regionUtil from '../regionUtil'

const REGION_CONDITION_PREFIX_MAP = {
  K: 'kommuneId',
  N: 'naringsregionId',
  B: 'bydelId',
  F: 'fylkeId'
}
/**
 * Converts a query on the internal app-specific query format to a visma-compliant query format
 */
export default function toVismaQuery({tableName, dimensions, /* string, i.e. K0101 */ region, unit}) {

  const conditions = dimensions.reduce((acc, dim) => Object.assign(acc, {[dim.name]: dim.variables}), {})
  const include = ['tabellvariabel', 'enhet'].concat(dimensions.map(dim => dim.name))

  if (region) {
    const [regionPrefix, regionCode] = regionUtil.split(region)

    const regionConditionKey = REGION_CONDITION_PREFIX_MAP[regionPrefix]
    assert(regionConditionKey, `No region key found for region type ${region.type}`)

    conditions[regionConditionKey] = [regionCode]
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
