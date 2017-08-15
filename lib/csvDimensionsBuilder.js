import fylker from './../data/fylker'
import bydeler from './../data/bydeler'
import naringsregioner from './../data/naeringsregioner'
import kommuner from './../data/kommuner'
import {dimensionLabelTitle, getDimensionLabels} from './labels'

/**
 * Build array with dimension labels for the CSV
 * See test for documentation
 */
export default function csvDimensionsBuilder() {

  const allDimensions = getDimensionLabels()

  // Append all variables from API
  const result = allDimensions.reduce((sum, dimension) => {
    if (!sum[dimension.name]) {
      sum[dimension.name] = {
        label: dimensionLabelTitle(dimension.name),
        values: dimension.variables.reduce((allVariables, variable) => {
          if (!allVariables[variable.label]) {
            allVariables[variable.label] = dimensionLabelTitle(dimension.name, variable.label)
          }
          return allVariables
        }, {})
      }
    }
    return sum
  }, {})

  // Append all local JSON data (counties and municipalities) to query
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
