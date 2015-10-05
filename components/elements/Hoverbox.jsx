import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'

export default class Hoverbox extends Component {
  static propTypes = {
    title: PropTypes.string,
    body: PropTypes.string,
    anchor: PropTypes.object, // A DOM node
  }

  render() {
    const {title, body, anchor} = this.props
    let style = {display: 'none'}
    if (anchor) {
      const offset = anchor.getBoundingClientRect()
      const el = findDOMNode(this)
      const bbox = el.getBoundingClientRect()
      const left = offset.left + offset.width / 2 - bbox.width / 2
      const top = offset.top + window.scrollY - bbox.height - 20
      style = {left, top}
    }

    return (
      <div className="hover-box" style={style}>
      <dl>
      <dt className="hover-box__title">{title}</dt>
      <dd>{body}</dd>
      </dl>
      <i className="hover-box__point"></i>
      </div>
    )
  }
}
