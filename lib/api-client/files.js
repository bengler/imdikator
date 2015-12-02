/**
 * A wrapper around various project files that provides data that may be provided by an api later
 */

import CARDS_PAGES from '../../data/cardPages'
import MUNICIPALITIES from '../../data/kommuner'
import COUNTIES from '../../data/fylker'
import COMMERCE_REGIONS from '../../data/naeringsregioner'
import BOROUGHS from '../../data/bydeler'

const ALL_REGIONS = MUNICIPALITIES.concat(COUNTIES, COMMERCE_REGIONS, BOROUGHS)

export function create() {

  return {
    getAllRegions,
    getRegionByCode,
    getCardsPageByName,
    getCardsPages
  }

  function getRegionByCode(regionCode) {
    return getAllRegions().then(allRegions => {
      const matchingRegion = allRegions.find(region => region.prefixedCode.toLowerCase() == regionCode)
      if (!matchingRegion) {
        return Promise.reject(new Error(`Region ${regionCode} not found`))
      }
      return Promise.resolve(matchingRegion)
    })
  }

  function getCardsPageByName(name) {
    return getCardsPages().then(cardsPages => {
      const found = cardsPages.find(group => group.name.toLowerCase() == name.toLowerCase())
      if (!found) {
        return Promise.reject(new Error(`Cards page with name ${name} not found`))
      }
      return found
    })
  }

  function getCardsPages() {
    return Promise.resolve(CARDS_PAGES)
  }

  function getAllRegions() {
    return Promise.resolve(ALL_REGIONS)
  }
}
