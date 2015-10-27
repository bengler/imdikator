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

  it('shortens billions to mrd', () => {
    const formatters = unitFormatter('kroner')
    assert.equal(formatters.format(9223716271), '9.2 mrd kr')
  })

  it('shortens millions to mill', () => {
    const formatters = unitFormatter('kroner')
    assert.equal(formatters.format(9283716), '9.3 mill kr')
  })

  it('formats per mil with ‰ character and 2 decimals', () => {
    const formatters = unitFormatter('promille')
    assert.equal(formatters.format(1.9), '1.9 ‰')
    assert.equal(formatters.format(19), '19.0 ‰')
    // Rounds
    assert.equal(formatters.format(0.7552312), '0.8 ‰')

    assert.equal(formatters.axisFormat(1.9), '1.9 ‰')
    assert.equal(formatters.axisFormat(19), '19.0 ‰')
    // Rounds
    assert.equal(formatters.axisFormat(0.7212312), '0.7 ‰')
  })

  it('formats per cent using 2 decimals and adding % character', () => {
    const formatters = unitFormatter('prosent')
    assert.equal(formatters.format(190), '190.0 %')
    assert.equal(formatters.format(29), '29.0 %')
    assert.equal(formatters.format(29.29), '29.3 %')
    assert.equal(formatters.format(0.9), '0.9 %')
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
