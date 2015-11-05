import DimensionLabels from './../data/dimensions.json'
import fylker from './../data/fylker'
import bydeler from './../data/bydeler'
import naringsregioner from './../data/naeringsregioner'
import kommuner from './../data/kommuner'
import capitalize from 'lodash.capitalize'
import assert from 'assert'

export function dimensionLabelTitle(dimensionName, variableName) {
  const dimension = DimensionLabels.find(item => {
    return item.name === dimensionName
  })

  const collections = {
    F: fylker,
    B: bydeler,
    K: kommuner,
    N: naringsregioner
  }

  if (dimensionName === 'region') {
    const prefix = variableName.substring(0, 1)
    const mapping = collections[prefix]
    let place = null
    if (mapping) {
      const identifier = variableName.substring(1, variableName.length)
      place = mapping.find(node => {
        return node.code === identifier
      })
    }

    if (place) {
      return place.name
    }
  }

  if (dimensionName === 'year') {
    if (variableName) {
      // you should not do this
      return variableName
    }
    return 'År'
  }

  if (dimensionName === 'unit') {
    if (variableName) {
      // you should not do this
      return capitalize(variableName)
    }
    return 'Enhet'
  }

  if (dimension) {
    /* eslint-disable max-depth */
    // Todo: fix
    if (variableName) {
      const variable = dimension.variables.find(item => {
        return item.label === variableName
      })
      if (variable) {
        return variable.title
      }
    } else {
      return dimension.title
    }
    /* eslint-enable max-depth */
  }

  if (variableName) {
    return variableName
  }

  return dimensionName
}

export function findDimensionByName(dimensionName) {
  const dimension = DimensionLabels.find(item => {
    return item.name === dimensionName
  })
  assert(dimension, `No configured dimension for ${dimensionName}`)
  return dimension
}
