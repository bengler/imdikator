import {dimensionLabelTitle} from './labels'

export default function csvDimensionsBuilder(dimensions) {

  const result = dimensions.reduce((allDimensions, dimension) => {
    if (!allDimensions.dimension) {
      allDimensions[dimension.name] = {
        label: dimensionLabelTitle(dimension.name),
        values: dimension.variables.reduce((allVariables, variable) => {
          if (!allVariables.variable) {
            allVariables[variable] = dimensionLabelTitle(dimension.name, variable)
          }
          return allVariables
        }, {})
      }
    }
    return allDimensions
  }, {})

  return result
}
