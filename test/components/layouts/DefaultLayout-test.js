import React from 'react/addons'
import {assert} from 'chai'
import DefaultLayout from '../../../components/layouts/DefaultLayout'

const {TestUtils} = React.addons

describe('DefaultLayout', () => {

  it('renders a #content element', () => {

    // Render a checkbox with label in the document
    const rendered = TestUtils.renderIntoDocument(<DefaultLayout/>)

    const divs = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'div')
    const content = divs.find(div => div.props['data-imdikator'] == 'site')
    assert(content, 'Expected one element with attribute: data-imdikator="site"')
  })
})
