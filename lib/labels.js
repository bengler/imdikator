import DimensionLabels from './../data/dimensions.json'

export function dimensionLabelTitle(dimensionName, variableName) {
  const dimension = DimensionLabels.find(item => {
    return item.name === dimensionName
  })

  if (dimension) {
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
  return ''
}
