import React from 'react'
import {findDOMNode} from 'react-dom'

const Hoverbox = React.createClass({

  getInitialState() {
    return {
      title: 'Title',
      body: 'Body',
      direction: 'bottom',
      el: null
    }
  },

  calculatePositionTo(element) {
    const offset = element.getBoundingClientRect()

    let left = 0
    let top = 0
    switch (this.state.direction) {
      case 'bottom': {
        left = offset.left - this.state.containerRect.left + offset.width / 2
        top = offset.top - this.state.containerRect.top
        break
      }
      case 'right': {
        left = offset.left - popoverBox.width - 20
        top = offset.top + window.scrollY - offset.height / 2
        break
      }
      case 'left': {
        left = offset.left + offset.width + 20
        top = offset.top + window.scrollY - offset.height / 2
        break
      }
      default: {
        left = 0
        top = 0
      }
    }
    return {top, left}
  },

  render() {
    const {title, body} = this.state
    const style = {
      position: 'absolute',
      left: 0,
      top: 0
    }

    if (this.state.el) {
      Object.assign(style, this.calculatePositionTo(this.state.el))
    }

    return (
      <div style={{position: 'relative', width: '100%', height: '0px'}}>
      <div className="hover-box" style={style}>
      <dl>
      <dt className="hover-box__title">{title}</dt>
      <dd>{body}</dd>
      </dl>
      <i className="hover-box__point"></i>
      </div>
      </div>
    )
  }
})

export default Hoverbox
