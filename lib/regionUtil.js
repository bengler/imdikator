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


export function split(region) {
  return [region.substring(0, 1).toUpperCase(), region.substring(1)]
}

export function prefixify(region) {
  assert(TYPE_TO_PREFIX[region.type], `No prefix registered for region type ${region.type}`)
  return TYPE_TO_PREFIX[region.type] + region.code
}

export function getHeaderKey(region) {
  assert(REGION_TYPE_TO_ID_FIELD_MAPPING[region.type], `No mapping from region type ${region.type} to header key found`)
  return REGION_TYPE_TO_ID_FIELD_MAPPING[region.type]
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

export function comparableMunicipalities(region, regions) {
  if (region.type != 'municipality') {
    return []
  }
  const matches = similarMunicipalities.find(thing => thing.code == region.code)
  if (!matches) {
    return []
  }
  return matches.similar.map(code => {
    return regionByCode(code, 'municipality', regions)
  })
}

export function comparableMunicipalityCodesPrefixified(region, regions) {
  return comparableMunicipalities(region, regions).map(reg => {
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
