import {assert} from 'chai'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {findInTree} from '../_react-utils/iterators'
import {assertInRenderTree, assertNotInRenderTree} from '../_react-utils/assert'
import CardMetadata from '../../../components/containers/CardMetadata'

function isToggleButton(el) {
  return el.type == 'a' && el.props.className.split(' ').includes('toggle__button')
}

describe('CardMetadata', () => {

  const renderer = TestUtils.createRenderer()

  it("doesn't render metadata when not expanded", () => {
    const element = (
      <CardMetadata
        description="Some description"
        terminology="Some terminology"
        source="Some source"
        measuredAt="Yesterday"
      />
    )
    renderer.render(element)

    const renderTree = renderer.getRenderOutput()

    assertNotInRenderTree(renderTree, 'Some description')
    assertNotInRenderTree(renderTree, 'Some terminology')
    assertNotInRenderTree(renderTree, 'Some source')
    assertNotInRenderTree(renderTree, 'Yesterday')
  })

  it('expands when clicked', () => {
    const metadata = {
      description: 'Some description',
      terminology: 'Some terminology',
      source: 'Some source',
      measuredAt: 'Yesterday'
    }

    const element = (
      <CardMetadata metadata={metadata}/>
    )
    renderer.render(element)

    const renderTreeBeforeClick = renderer.getRenderOutput()

    const toggleButton = renderTreeBeforeClick::findInTree(isToggleButton)

    assert(toggleButton, 'No toggle button found in render tree')

    toggleButton.props.onClick({
      preventDefault() {}
    })

    renderer.render(element)
    const renderTreeAfterClick = renderer.getRenderOutput()

    const buttonAfterClick = renderTreeAfterClick::findInTree(isToggleButton)

    assert(toggleButton, 'No toggle button found in render tree after click')
    assert(buttonAfterClick.props.className.split(' ').includes('toggle__button--expanded'))

    assertInRenderTree(renderTreeAfterClick, metadata.description)
    assertInRenderTree(renderTreeAfterClick, metadata.terminology)
    assertInRenderTree(renderTreeAfterClick, metadata.source)
    assertInRenderTree(renderTreeAfterClick, metadata.measuredAt)

  })
})
