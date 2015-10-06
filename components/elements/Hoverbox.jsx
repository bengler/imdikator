import React from 'react'

const Hoverbox = React.createClass({

  getInitialState() {
    return {
      title: '',
      body: '',
      direction: 'bottom',
      el: null
    }
  },

  calculatePositionTo(element) {
    const offset = element.getBoundingClientRect()

    let left = 0
    let bottom = 0
    switch (this.state.direction) {
      case 'bottom': {
        left = offset.left - this.state.containerRect.left + offset.width / 2
        bottom = this.state.containerRect.height
                 - (offset.top - this.state.containerRect.top)
        break
      }
      case 'right': {
        break
      }
      case 'left': {
        break
      }
      default: {
        left = 0
        //top = 0
      }
    }
    return {left, bottom}
  },

  render() {
    const {title, body} = this.state
    const style = {
      display: 'none',
      pointerEvents: 'none'
    }

    const styleClasses = ['hover-box']
    /*
    switch (this.state.direction) {
      case 'left':
        styleClasses.push('hover-box--left-edge')
        break
      case 'right':
        styleClasses.push('hover-box--right-edge')
        break
      default:
    }
    */

    if (this.state.el) {
      Object.assign(style, {
        display: 'block'
      }, this.calculatePositionTo(this.state.el))
    }

    return (
      <div className={styleClasses.join(' ')} style={style}>
      <dl>
      <dt className="hover-box__title">{title}</dt>
      <dd>{body}</dd>
      </dl>
      <i className="hover-box__point"></i>
      </div>
    )
  }
})

export default Hoverbox
