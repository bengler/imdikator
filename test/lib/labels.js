import {assert} from 'chai'
import {dimensionLabelTitle} from '../../lib/labels'

describe('Title for category', () => {
  it('returns the title stored in data/dimensions.json', () => {
    assert.equal('Innvandrerbakgrunn femdelt', dimensionLabelTitle('innvkat5'))
    assert.equal('befolkningen unntatt innvandrere', dimensionLabelTitle('innvkat5', 'befolkningen_ellers'))
    assert.equal('mann', dimensionLabelTitle('kjonn', '1'))
  })

  it('returns the variable or dimension for unknown keys', () => {
    assert.equal('unknown', dimensionLabelTitle('unknown'))
    assert.equal('variable', dimensionLabelTitle('unknown', 'variable'))
  })
})
