import {getHeaderKeyForRegionCode} from './regionUtil'

export function findHeaderGroupForQuery(query, headerGroups) {
  const regionHeaderKey = getHeaderKeyForRegionCode(query.region)
  return headerGroups.find(group => {
    return group.hasOwnProperty(regionHeaderKey) && query.dimensions.every(dim => group.hasOwnProperty(dim.name))
  })
}
