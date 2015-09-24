import assert from 'assert'
const PREFIXES = {
  municipality: 'K',
  borough: 'B',
  county: 'F',
  commerceRegion: 'N'
}

export function split(region) {
  return [
    region.substring(0, 1).toUpperCase(),
    region.substring(1)
  ]
}

export function prefixify(region) {
  assert(PREFIXES[region.type], `No prefix registered for region type ${region.type}`)
  return PREFIXES[region.type] + region.code
}
