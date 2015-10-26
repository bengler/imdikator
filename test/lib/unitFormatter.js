import {assert} from 'chai'
import {unitFormatter} from '../../lib/unitFormatter'

describe('unitFormatter', () => {
  it('returns an object with format and axisFormat functions', () => {
    const formatters = unitFormatter()
    assert.property(formatters, 'format')
    assert.typeOf(formatters.format, 'function')
    assert.property(formatters, 'axisFormat')
    assert.typeOf(formatters.axisFormat, 'function')
  })

  it('formats money with toLocaleString()', () => {
    const formatters = unitFormatter('kroner')

    const expected = `${parseFloat(1999).toLocaleString()} kr`
    assert.equal(formatters.format(1999), expected)
    assert.equal(formatters.axisFormat(1999), expected)
  })

  it('formats per mil with ‰ character and 2 decimals', () => {
    const formatters = unitFormatter('promille')
    assert.equal(formatters.format(1.9), '1.90 ‰')
    assert.equal(formatters.format(19), '19.00 ‰')
    assert.equal(formatters.format(0.7512312), '0.75 ‰')

    assert.equal(formatters.axisFormat(1.9), '1.90 ‰')
    assert.equal(formatters.axisFormat(19), '19.00 ‰')
    assert.equal(formatters.axisFormat(0.7512312), '0.75 ‰')
  })

  it('formats per cent using 2 decimals and adding % character', () => {
    const formatters = unitFormatter('prosent')
    assert.equal(formatters.format(190), '190.00 %')
    assert.equal(formatters.format(29), '29.00 %')

  })

  it('formats per cent on axis with no decimals', () => {
    const formatters = unitFormatter('prosent')
    assert.equal(formatters.axisFormat(19), '19 %')
    assert.equal(formatters.axisFormat(0.29), '0 %')
  })

  it('formats unknown units with toLocaleString()', () => {
    const formatters = unitFormatter('something')
    assert.equal(formatters.format(1.9), `${parseFloat(1.9).toLocaleString()}`)
    assert.equal(formatters.format(19), `${parseFloat(19).toLocaleString()}`)
    assert.equal(formatters.format(1.292929), `${parseFloat(1.292929).toLocaleString()}`)
    assert.equal(formatters.format(292929), `${parseFloat(292929).toLocaleString()}`)

    assert.equal(formatters.axisFormat(1.9), `${parseFloat(1.9).toLocaleString()}`)
    assert.equal(formatters.axisFormat(19), `${parseFloat(19).toLocaleString()}`)
    assert.equal(formatters.axisFormat(1.292929), `${parseFloat(1.292929).toLocaleString()}`)
    assert.equal(formatters.axisFormat(292929), `${parseFloat(292929).toLocaleString()}`)
  })
})
