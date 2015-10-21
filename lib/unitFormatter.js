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
  let format = d3Format('g')
  let axisFormat = d3Format('g')
  switch (unit) {
    case 'prosent': {
      format = d3Format('.2%')
      axisFormat = d3Format('%')
      break
    }
    case 'promille': {
      const _format = d3Format('.2g')
      format = function (val) {
        return `${_format(val)}‰`
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
