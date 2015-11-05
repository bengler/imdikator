import {assert} from 'chai'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {findInTree, someInTree} from '../_react-utils/iterators'
import RegionFilterSelect from '../../../components/elements/filter/RegionFilterSelect'
import Lightbox from '../../../components/elements/Lightbox'
import RegionPicker from '../../../components/elements/filter/RegionPicker'

describe('RegionSelect', () => {

  const renderer = TestUtils.createRenderer()

  it('renders without any props', () => {
    const element = (
      <RegionFilterSelect/>
    )
    renderer.render(element)

    const renderTree = renderer.getRenderOutput()
    assert(renderTree)
  })

  it('opens region picker in a lightbox when clicked', () => {
    const element = (
      <RegionFilterSelect renderChoice={item => item.name}
      />
    )

    renderer.render(element)

    const renderTree = renderer.getRenderOutput()
    const button = renderTree::findInTree(el => {
      return el && el.type === 'button'
    })
    button.props.onClick()
    renderer.render(element)

    const renderTreeAfter = renderer.getRenderOutput()
    assert(renderTreeAfter::someInTree(el => el.type == Lightbox), `Expected a Lightbox element to be in render tree`)
    assert(renderTreeAfter::someInTree(el => el.type == RegionPicker), `Expected a RegionPicker element to be in render tree`)
  })
})
