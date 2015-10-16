import assert from 'assert'
import similarMunicipalities from '../data/similarMunicipalities'

function mirror(object) {
  return Object.keys(object).reduce((acc, key) => {
    acc[object[key]] = key
    return acc
  }, {})
}

const REGION_TYPE_TO_PREFIX = {
  municipality: 'K',
  borough: 'B',
  county: 'F',
  commerceRegion: 'N'
}

const PREFIX_TO_TYPE = mirror(REGION_TYPE_TO_PREFIX)

const REGION_TYPE_TO_HEADER_KEY_MAPPING = {
  municipality: 'kommuneNr',
  county: 'fylkeNr',
  commerceRegion: 'naringsregionNr',
  borough: 'bydelNr'
}
const HEADER_KEY_TO_REGION_TYPE_MAPPING = mirror(REGION_TYPE_TO_HEADER_KEY_MAPPING)


export function split(regionCode) {
  return [regionCode.substring(0, 1).toUpperCase(), regionCode.substring(1)]
}

export function prefixifyRegion(region) {
  return region.prefixedCode
}

export function getRegionTypeFromHeaderKey(headerKey) {
  const regionType = HEADER_KEY_TO_REGION_TYPE_MAPPING[headerKey]
  assert(regionType, `No region type mapping for header key ${headerKey}`)
  return regionType
}
export function prefixify(regionType, regionCode) {
  assert(REGION_TYPE_TO_PREFIX[regionType], `No prefix registered for region type ${regionType}`)
  return REGION_TYPE_TO_PREFIX[regionType] + regionCode
}

export function getHeaderKey(region) {
  assert(REGION_TYPE_TO_HEADER_KEY_MAPPING[region.type], `No mapping from region type ${region.type} to header key found`)
  return REGION_TYPE_TO_HEADER_KEY_MAPPING[region.type]
}
export function getHeaderKeyForRegionCode(regionCode) {
  const [prefix] = split(regionCode)
  const headerKey = REGION_TYPE_TO_HEADER_KEY_MAPPING[typeForPrefix(prefix)]
  assert(headerKey, `Unable to find header key for ${regionCode} (prefix ${prefix})`)
  return headerKey
}

export function getHeaderKeyNames() {
  return Object.values(REGION_TYPE_TO_HEADER_KEY_MAPPING)
}

export function typeForPrefix(prefix) {
  return PREFIX_TO_TYPE[prefix.toUpperCase()]
}

export function regionByCode(code, type, regions) {
  return regions.find(region => (region.code == code) && region.type == type)
}

export function regionByPrefixedCode(prefixedCode, regions) {
  return regions.find(region => region.prefixedCode == prefixedCode)
}

export function regionsByParent(parentType, parentCode, regions) {
  return regions.filter(region => (region[parentType] == parentCode) && region.name.indexOf('Uoppgitt bydel') < 0)
}

export function parentRegion(parentType, parentCode, regions) {
  return regions.find(region => (region.code == parentCode) && parentType == region.type)
}

export function comparableRegions(region, regions) {
  switch (region.type) {

    // borough, show boroughs in same municipality
    case 'borough':
      return regions.filter(thing => thing.type == 'borough' && thing.code != region.code && thing.municipalityCode == region.municipalityCode && thing.name.indexOf('Uoppgitt bydel') < 0)

    // commerceRegion, show other commerceRegions in same county
    case 'commerceRegion':
      return regions.filter(thing => thing.type == 'commerceRegion' && thing.code != region.code && thing.countyCode == region.countyCode)

    // county, show all other counites
    case 'county':
      return regions.filter(thing => thing.type == 'county' && thing.code != region.code && thing.code != '00' && thing.name != 'Uoppgitt fylke')

    // municipality, look up hard coded list
    case 'municipality':
      const matches = similarMunicipalities.find(thing => thing.code == region.code)
      if (!matches) {
        return []
      }
      return matches.similar.map(code => {
        return regionByCode(code, 'municipality', regions)
      })
    default:
      return []
  }
}


export function countyNorway() {
  return {
    code: '00',
    name: 'Hele landet',
    type: 'county',
    prefixedCode: 'F00'
  }
}
