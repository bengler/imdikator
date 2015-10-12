import assert from 'assert'
import similarMunicipalities from '../data/similarMunicipalities'

const TYPE_TO_PREFIX = {
  municipality: 'K',
  borough: 'B',
  county: 'F',
  commerceRegion: 'N'
}

const PREFIX_TO_TYPE = Object.keys(TYPE_TO_PREFIX).reduce((acc, key) => {
  acc[TYPE_TO_PREFIX[key]] = key
  return acc
}, {})

const REGION_TYPE_TO_ID_FIELD_MAPPING = {
  municipality: 'kommuneNr',
  county: 'fylkeNr',
  commerceRegion: 'naringsregionNr',
  borough: 'bydelNr'
}


export function split(regionCode) {
  return [regionCode.substring(0, 1).toUpperCase(), regionCode.substring(1)]
}

export function prefixify(region) {
  assert(TYPE_TO_PREFIX[region.type], `No prefix registered for region type ${region}`)
  return TYPE_TO_PREFIX[region.type] + region.code
}

export function getHeaderKey(region) {
  assert(REGION_TYPE_TO_ID_FIELD_MAPPING[region.type], `No mapping from region type ${region.type} to header key found`)
  return REGION_TYPE_TO_ID_FIELD_MAPPING[region.type]
}
export function getHeaderKeyForRegionCode(regionCode) {
  const [prefix] = split(regionCode)
  const headerKey = REGION_TYPE_TO_ID_FIELD_MAPPING[typeForPrefix(prefix)]
  assert(headerKey, `Unable to find header key for ${regionCode} (prefix ${prefix})`)
  return headerKey
}

export function typeForPrefix(prefix) {
  return PREFIX_TO_TYPE[prefix.toUpperCase()]
}

export function regionByCode(code, type, regions) {
  return regions.filter(region => (region.code == code) && region.type == type)[0]
}

export function regionsByParent(parentType, parentCode, regions) {
  return regions.filter(region => region[parentType] == parentCode)
}

export function comparableRegions(region, regions) {
  // borough, show boroughs in same city
  // commerceRegion, show other commerceRegions in same county

  switch (region.type) {
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

export function comparableRegionCodesPrefixified(region, regions) {
  return comparableRegions(region, regions).map(reg => {
    return prefixify(reg)
  })
}

export function countyNorway() {
  return {
    code: '00',
    name: 'Hele landet',
    type: 'county'
  }
}
