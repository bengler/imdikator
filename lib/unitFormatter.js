import {locale} from 'd3'

const localeDef = {
  decimal: ',',
  thousands: '\u00A0',
  grouping: [3],
  currency: ['', '\u00A0kr'],
  dateTime: '%a %b %e %X %Y',
  date: '%m/%d/%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
  shortDays: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
  months: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli',
          'August', 'September', 'Oktober', 'November', 'Desember'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
}

const d3Format = locale(localeDef).numberFormat


function stripZeroDecimal(str) {
  return str.replace(`${localeDef.decimal}0`, '')
}

function nonBreakingSpaces(str) {
  return str.replace(/ /g, '\u00A0')
}
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
    let res = d3Format(',.1f')(val)
    res = stripZeroDecimal(res)
    return nonBreakingSpaces(res)
  }
  let axisFormat = format
  switch (unit) {
    case 'prosent': {
      const _format = d3Format('.1f')
      format = function (val) {
        let res = `${_format(val)} %`
        res = stripZeroDecimal(res)
        return nonBreakingSpaces(res)
      }
      const _axisFormat = d3Format('f')
      axisFormat = function (val) {
        let res = `${_axisFormat(val)} %`
        res = stripZeroDecimal(res)
        return nonBreakingSpaces(res)
      }
      break
    }
    case 'promille': {
      const _format = d3Format('.1f')
      format = function (val) {
        let res = `${_format(val)} ‰`
        res = stripZeroDecimal(res)
        return nonBreakingSpaces(res)
      }
      axisFormat = format
      break
    }
    case 'kroner': {
      const _format = d3Format('.1f')
      const billion = 1000000000.0
      const million = 1000000.0
      let res = ''
      format = function (val) {
        if (val >= billion) {
          res = `${_format(val / billion)} mrd kr`
        } else if (val >= million) {
          res = `${_format(val / million)} mill kr`
        } else {
          res = `${d3Format(',d')(val)} kr`
        }
        res = stripZeroDecimal(res)
        return nonBreakingSpaces(res)
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
