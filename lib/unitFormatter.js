import {format as d3Format} from 'd3'

/*
Returns an object with a general formatter function and an
axis formatter function:
{
  axisFormat: function
  format: function,
}
*/
export function unitFormatter(unit = '') {
  let format = function (val) {
    return parseFloat(val).toLocaleString()
  }
  let axisFormat = format
  switch (unit) {
    case 'prosent': {
      const _format = d3Format('.2f')
      format = function (val) {
        return `${_format(val * 100)} %`
      }
      axisFormat = format
      break
    }
    case 'promille': {
      const _format = d3Format('.2f')
      format = function (val) {
        return `${_format(val)} ‰`
      }
      axisFormat = format
      break
    }
    case 'kroner': {
      format = function (val) {
        return `${val.toLocaleString()} kr`
      }
      axisFormat = format
      break
    }
    default: {
      break
    }
  }

  return {axisFormat, format}
}
