import DimensionLabels from './../data/dimensions.json'
import fylker from './../data/fylker'

export function dimensionLabelTitle(dimensionName, variableName) {
  const dimension = DimensionLabels.find(item => {
    return item.name === dimensionName
  })

  if (dimensionName === 'fylkeId') {
    const fylke = fylker.find(node => parseFloat(node.code) == parseFloat(variableName))
    if (fylke) {
      return fylke.name
    }
  } else if (dimension) {
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
  }

  if (variableName) {
    return variableName
  }

  return dimensionName
}
