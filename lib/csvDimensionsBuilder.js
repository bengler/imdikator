import fylker from './../data/fylker'
import bydeler from './../data/bydeler'
import naringsregioner from './../data/naeringsregioner'
import kommuner from './../data/kommuner'
import {dimensionLabelTitle} from './labels'

/**
 * Build array with dimension labels for the CSV
 * See test for documentation
 * @param {array} dimensions List of dimensions to be included
 */
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

  // Append all counties and municipalities to query
  const regionData = fylker.concat(bydeler, naringsregioner, kommuner)
  result.region = {
    label: 'Name',
    values: regionData.reduce((allRegions, region) => {
      allRegions[region.prefixedCode] = dimensionLabelTitle('region', region.prefixedCode)
      return allRegions
    }, {})
  }

  return result
}
