import assert from 'assert'
import * as regionUtil from '../../regionUtil'
import inspect from 'object-inspect'

const REGION_CONDITION_PREFIX_MAP = {
  K: 'kommuneNr',
  N: 'naringsregionNr',
  B: 'bydelNr',
  F: 'fylkeNr'
}

const REGION_CONDITION_PREFIX_MAP_REVERSED = Object.keys(REGION_CONDITION_PREFIX_MAP).reduce((reversed, key) => {
  reversed[REGION_CONDITION_PREFIX_MAP[key]] = key
  return reversed
}, {})

export function getRegionConditionKeyFromPrefix(prefix) {
  const regionConditionKeyFromPrefix = REGION_CONDITION_PREFIX_MAP[prefix]
  assert(regionConditionKeyFromPrefix, `No region key found for region type prefix ${prefix}`)
  return regionConditionKeyFromPrefix
}

export function getPrefixForRegionConditionKey(key) {
  const regionPrefixFromKey = REGION_CONDITION_PREFIX_MAP_REVERSED[key]
  assert(regionPrefixFromKey, `No region prefix found for region key ${key}`)
  return regionPrefixFromKey
}

/**
 * Converts a query on the internal app-specific query format to a visma-compliant query format
 */
export default function toVismaQuery(query) {

  const {
    tableName,
    dimensions,
    region,
    comparisonRegions,
    unit,
    year
  } = query

  assert(tableName, `Missing 'tableName' in query: ${inspect(query)}`)
  assert(dimensions, `Missing 'dimensions' in query: ${inspect(query)}`)

  const conditions = dimensions.reduce((acc, dim) => {
    if (!dim.variables) {
      return acc
    }
    return Object.assign(acc, {[dim.name]: dim.variables})
  }, {})

  const include = dimensions.map(dim => dim.name)

  if (region) {
    const [regionPrefix, regionCode] = regionUtil.split(region)

    const regionConditionKey = getRegionConditionKeyFromPrefix(regionPrefix)

    // Rewrite candidate
    if (regionCode != 'All') {
      conditions[regionConditionKey] = [regionCode]
    }

    include.push(regionConditionKey)

  }

  if (comparisonRegions && comparisonRegions.length > 0) {
    comparisonRegions.forEach(cmpRegion => {
      const [prefix, code] = regionUtil.split(cmpRegion)
      const regionConditionKey = getRegionConditionKeyFromPrefix(prefix)
      conditions[regionConditionKey] = conditions[regionConditionKey] || []
      conditions[regionConditionKey].push(code)

      if (!include.includes(regionConditionKey)) {
        include.push(regionConditionKey)
      }

    })
  }

  if (unit) {
    include.push('enhet')
    conditions.enhet = unit
  }

  if (year) {
    include.push('aar')
    if (year !== 'all') {
      conditions.aar = year
    }
  }

  return {
    tableName: tableName,
    include: include,
    conditions: conditions
  }
}
