import assert from 'assert'
import similarMunicipalities from '../data/similarMunicipalities'

function mirror(object) {
  return Object.keys(object).reduce((acc, key) => {
    acc[object[key]] = key
    return acc
  }, {})
}

function allRegionsOfType(type, skip, regions) {
  const unsorted = regions.filter(region => (region.type == type) && region.prefixedCode != skip && !region.name.includes('Uoppgitt'))
  return unsorted.sort((reg1, reg2) => {
    return (reg1.name < reg2.name) ? -1 : 1
  })
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

//TODO: get rid of this function and refactor any usage
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

export function allCounties(regions) {
  return allRegionsOfType('county', 'F00', regions)
}

export function allMunicipalities(regions) {
  return allRegionsOfType('municipality', 'K00', regions)
}

export function allCommerceRegions(regions) {
  return allRegionsOfType('commerceRegion', 'N00', regions)
}

export function regionByCode(code, type, regions) {
  return regions.find(region => (region.code == code) && region.type == type)
}

export function regionByPrefixedCode(prefixedCode, regions) {
  return regions.find(region => region.prefixedCode == prefixedCode)
}

export function childRegionsByParent(childType, parentRegion, regions) {
  return regions.filter(region => {
    const childParentCode = `${parentRegion.type}Code`
    const isChild = region[childParentCode] == parentRegion.code
    const childMatchesType = region.type == childType
    return isChild && childMatchesType && !region.name.includes('Uoppgitt')
  })
}

export function parentRegionByType(parentType, parentCode, regions) {
  return regions.find(region => (region.code == parentCode) && parentType == region.type)
}


export function isSimilarRegion(region) {
  const fromSimilarMapping = region.type === 'municipality' && similarMunicipalities.find(candidate => candidate.code == region.code)

  return function (otherRegion) {
    if (region.type !== otherRegion.type) {
      // two different types of regions cannot be similar
      return false
    }
    if (region.code === otherRegion.code) {
      // a region is not similar to itself
      return false
    }
    switch (region.type) {
      // borough, show boroughs in same municipality
      case 'borough':
        return otherRegion.municipalityCode == region.municipalityCode && !otherRegion.name.includes('Uoppgitt bydel')

      // commerceRegion, show other commerceRegions in same county
      case 'commerceRegion':
        return otherRegion.countyCode == region.countyCode

      // county, show all other counites
      case 'county':
        return otherRegion.code != '00' && otherRegion.name != 'Uoppgitt fylke'

      // municipality, look up hard coded list
      case 'municipality':
        return fromSimilarMapping.similar.some(code => otherRegion.code === code)

      default:
        throw new Error(`Missing region type when looking for similar regions of ${region}`)
    }
  }
}


export function comparisonDescription(region) {
  switch (region.type) {
    case 'borough':
      return 'Bydelene i samme kommune'
    case 'municipality':
      return 'Lignende kommuner'
    case 'county':
      return 'De andre fylkene'
    case 'commerceRegion':
      return 'De andre næringsregionene i fylket'
    default:
      return 'Lignende steder'
  }
}


// Called from Card.jsx where the user chooses the content of a CSV file to download
export function downloadChoicesByRegion(region, allRegions) {
  switch (region.type) {

    case 'borough':
      const oslo = regionByPrefixedCode('K0301', allRegions)
      return [
        {
          value: 0,
          description: 'Alle bydelene i Oslo',
          regions: childRegionsByParent('borough', oslo, allRegions)
        }
      ]

    case 'municipality':
      return [
        {
          value: 0,
          description: 'Lignende kommuner',
          regions: allRegions.filter(isSimilarRegion(region))
        },
        {
          value: 1,
          description: 'Alle kommunene i Norge',
          regions: allMunicipalities(allRegions)
        }
      ]

    case 'county':
      return [
        {
          value: 0,
          description: `Kommuner i ${region.name}`,
          regions: childRegionsByParent('municipality', region, allRegions)
        },
        {
          value: 1,
          description: 'Alle fylkene i Norge',
          regions: allCounties(allRegions)
        }
      ]

    case 'commerceRegion':
      const county = regionByCode(region.countyCode, 'county', allRegions)
      return [
        {
          value: 0,
          description: `Næringsregionene i ${county.name}`,
          regions: childRegionsByParent('commerceRegion', county, allRegions)
        },
        {
          value: 1,
          description: 'Alle næringsregioner i Norge',
          regions: allCommerceRegions(allRegions)
        }
      ]

    default:
      return []
  }
}


export const norway = {
  code: '00',
  name: 'Hele landet',
  type: 'county',
  prefixedCode: 'F00'
}
