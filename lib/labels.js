import DimensionLabels from './../data/dimensions.json'
import fylker from './../data/fylker'
import bydeler from './../data/bydeler'

export function dimensionLabelTitle(dimensionName, variableName) {
  const dimension = DimensionLabels.find(item => {
    return item.name === dimensionName
  })

  switch (dimensionName) {
    case 'fylkeNr': {
      const fylke = fylker.find(node => parseFloat(node.code) == parseFloat(variableName))
      if (fylke) {
        return fylke.name
      }
      break
    }
    case 'bydelNr': {
      const bydel = bydeler.find(node => parseFloat(node.code) == parseFloat(variableName))
      if (bydel) {
        return bydel.name
      }
      break
    }
    default: {
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
          return dimension.description
        }
        /* eslint-enable max-depth */
      }
    }
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
  return dimension
}
