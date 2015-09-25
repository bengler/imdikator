import assert from 'assert'
const TYPE_TO_PREFIXES = {
  municipality: 'K',
  borough: 'B',
  county: 'F',
  commerceRegion: 'N'
}

// we might need this reverse mapping at some point later
//const PREFIX_TO_TYPE = Object.keys(TYPE_TO_PREFIXES).reduce((acc, key) => {
//  acc[TYPE_TO_PREFIXES[key]] = key
//  return acc
//}, {})

const REGION_TYPE_TO_ID_FIELD_MAPPING = {
  municipality: 'kommuneNr',
  county: 'fylkeNr',
  commerceRegion: 'naringsregionNr'
}

export function split(region) {
  return [
    region.substring(0, 1).toUpperCase(),
    region.substring(1)
  ]
}

export function prefixify(region) {
  assert(TYPE_TO_PREFIXES[region.type], `No prefix registered for region type ${region.type}`)
  return TYPE_TO_PREFIXES[region.type] + region.code
}

export function getHeaderKey(region) {
  assert(REGION_TYPE_TO_ID_FIELD_MAPPING[region.type], `No mapping from region type ${region.type} to header key found`)
  return REGION_TYPE_TO_ID_FIELD_MAPPING[region.type]
}
