const PREFIXES = {
  municipality: 'K',
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
  return PREFIXES[region.type] + region.code
}
