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

  it('formats permille with ‰ character', () => {
    const formatters = unitFormatter('promille')
    assert.equal(formatters.format(1.9), '1.9‰')
    assert.equal(formatters.format(19), '19‰')
  })

  it('formats per cent by multiplying by 100, using 2 decimals and adding % character', () => {
    const formatters = unitFormatter('prosent')
    assert.equal(formatters.format(1.9), '190.00%')
    assert.equal(formatters.format(0.29), '29.00%')
  })

  it('formats unknown units as plain numbers', () => {
    const formatters = unitFormatter('something')
    assert.equal(formatters.format(1.9), '1.9')
    assert.equal(formatters.format(19), '19')
    assert.equal(formatters.format(292929), '292929')
  })
})
