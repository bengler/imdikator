import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {findInShallowRenderTree} from '../_react-utils/findInShallowRenderTree.js'
import {assert} from 'chai'
import DefaultLayout from '../../../../components/layouts/DefaultLayout'

describe('DefaultLayout', () => {

  it('renders a #content element', () => {

    const renderer = TestUtils.createRenderer()

    // Render a checkbox with label in the document
    renderer.render(<DefaultLayout/>)

    const found = findInShallowRenderTree(renderer.getRenderOutput(), el => {
      return el.props && el.props['data-imdikator'] == 'site'
    })
    assert(found, 'Expected at least one element with attribute: data-imdikator="site"')
  })
})
