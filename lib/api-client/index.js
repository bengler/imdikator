/**
 * This is a facade wrapping the Visma API, the Epinova API and the project files API
 */
import assert from 'assert'
import {keyBy, omit} from 'lodash'

export function create({vismaAPI, epinovaAPI, fileAPI, nodeAPI} = {}) {

  assert(vismaAPI, 'You must provide a Visma API client when calling apiClient.create(...)')
  assert(epinovaAPI, 'You must provide a Epinova API client when calling apiClient.create(...)')
  assert(fileAPI, 'You must provide a file API client when calling apiClient.create(...)')
  assert(nodeAPI, 'You must provide a node API client when calling apiClient.create(...)')

  return {
    getHeaderGroups: vismaAPI.getHeaderGroups,
    query: vismaAPI.query,
    getCsvFile: nodeAPI.getCsvFile,

    getDimensionLabels: epinovaAPI.getDimensionLabels,

    getVariableDefinitions: epinovaAPI.getVariableDefinitions,

    getAllRegions: fileAPI.getAllRegions,
    getRegionByCode: fileAPI.getRegionByCode,
    getCardsPageByName: getCardsPageByName,
    getCardsPages: _getDecoratedCardsPages
  }

  function _getDecoratedCardsPages() {
    const gotIndexedCardsDescriptions = epinovaAPI.getCardsDescriptions().then(cardsDescriptions => {
      return keyBy(cardsDescriptions, 'cardName')
    })
    const gotCardsPages = fileAPI.getCardsPages()

    return Promise.all([gotCardsPages, gotIndexedCardsDescriptions]).then(([cardsPages, indexedCardsDescriptions]) => {
      return cardsPages.map(cardsPage => {
        return Object.assign({}, cardsPage, {
          cards: cardsPage.cards.map(card => {
            return Object.assign({}, card, {
              metadata: omit(indexedCardsDescriptions[card.name], 'cardName')
            })
          })
        })
      })
    })
  }

  function getCardsPageByName(name) {
    return _getDecoratedCardsPages().then(cardsPages => {

      const found = cardsPages.find(cardsPage => cardsPage.name.toLowerCase() == name.toLowerCase())
      if (!found) {
        return Promise.reject(new Error(`Cards page with name ${name} not found`))
      }
      return found
    })
  }

}
