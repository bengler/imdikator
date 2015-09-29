import assert from 'assert'
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
  commerceRegion: 'naringsregionNr'
}

module.exports = {

  split: region => {
    return [
      region.substring(0, 1).toUpperCase(),
      region.substring(1)
    ]
  },

  prefixify: region => {
    assert(TYPE_TO_PREFIX[region.type], `No prefix registered for region type ${region.type}`)
    return TYPE_TO_PREFIX[region.type] + region.code
  },

  getHeaderKey: region => {
    assert(REGION_TYPE_TO_ID_FIELD_MAPPING[region.type], `No mapping from region type ${region.type} to header key found`)
    return REGION_TYPE_TO_ID_FIELD_MAPPING[region.type]
  },

  typeForPrefix: prefix => {
    return PREFIX_TO_TYPE[prefix.toUpperCase()]
  }

}
