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
      const _format = d3Format('.1f')
      format = function (val) {
        const res = `${_format(val)} %`
        return res.replace(/ /g, '\u00A0')
      }
      const _axisFormat = d3Format('f')
      axisFormat = function (val) {
        const res = `${_axisFormat(val)} %`
        return res.replace(/ /g, '\u00A0')
      }
      break
    }
    case 'promille': {
      const _format = d3Format('.1f')
      format = function (val) {
        const res = `${_format(val)} ‰`
        return res.replace(/ /g, '\u00A0')
      }
      axisFormat = format
      break
    }
    case 'kroner': {
      const _format = d3Format('.1f')
      const billion = 1000000000.0
      const million = 1000000.0
      format = function (val) {
        if (val > billion) {
          return `${_format(val / billion)} mrd kr`
        } else if (val > million) {
          return `${_format(val / million)} mill kr`
        }
        const res = `${val.toLocaleString()} kr`
        return res.replace(/ /g, '\u00A0')
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
