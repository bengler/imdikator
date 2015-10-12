import {assert} from 'chai'
import {dimensionLabelTitle} from '../../lib/labels'

describe('Title for category', () => {
  it('returns the title stored in data/dimensions.json', () => {
    assert.equal(dimensionLabelTitle('innvkat5'), 'Innvandrerbakgrunn femdelt')
    assert.equal(dimensionLabelTitle('innvkat5', 'befolkningen_ellers'), 'befolkningen unntatt innvandrere')
    assert.equal(dimensionLabelTitle('kjonn', '1'), 'mann')
  })

  it('returns the variable or dimension for unknown keys', () => {
    assert.equal(dimensionLabelTitle('unknown'), 'unknown')
    assert.equal(dimensionLabelTitle('unknown', 'variable'), 'variable')
  })
})
