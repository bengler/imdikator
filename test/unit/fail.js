import {assert} from 'chai'

describe('Travis integration', () => {
  it('sends notifications on failure', () => {
    assert.equal(2 + 2, 5, 'Expected 2 + 2 to be 5')
  })
})
