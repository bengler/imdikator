import React, {Component} from 'react'

class Hoverbox extends Component {

  static propTypes = {
    el: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      title: '',
      body: '',
      direction: 'bottom',
      el: props.el
    }
  }

  calculatePositionTo(element) {
    const offset = element.getBoundingClientRect()

    const left = offset.left - this.state.containerRect.left + offset.width / 2
    const bottom = this.state.containerRect.height
                 - (offset.top - this.state.containerRect.top)
    return {left, bottom}
  }

  calculateDirection(element) {
    const horizontalMargin = 150
    const verticalMargin = 135

    const offset = element.getBoundingClientRect()
    const left = offset.left - this.state.containerRect.left + offset.width / 2
    const right = this.state.containerRect.right - offset.right + offset.width / 2
    const top = offset.top - this.state.containerRect.top

    if (top < verticalMargin) {
      if (left < horizontalMargin) {
        return 'top-left'
      } else if (right < horizontalMargin) {
        return 'top-right'
      }
      return 'top'
    } else if (left < horizontalMargin) {
      return 'left'
    } else if (right < horizontalMargin) {
      return 'right'
    }
    return 'bottom'
  }

  render() {
    const {title, body} = this.state
    const style = {
      display: 'none',
      pointerEvents: 'none'
    }

    const styleClasses = ['hover-box']
    if (this.state.el) {

      const direction = this.calculateDirection(this.state.el)

      switch (direction) {
        case 'left':
          styleClasses.push('hover-box--left')
          break
        case 'right':
          styleClasses.push('hover-box--right')
          break
        case 'top':
          styleClasses.push('hover-box--top')
          break
        case 'top-right':
          styleClasses.push('hover-box--top-right')
          break
        case 'top-left':
          styleClasses.push('hover-box--top-left')
          break
        default:
      }

      Object.assign(style, {
        display: 'block'
      }, this.calculatePositionTo(this.state.el))
    }

    return (
      <div role="alert">
        <div className={styleClasses.join(' ')} style={style}>
          <dl>
            <dt className="hover-box__title">{title}</dt>
            <dd>{body}</dd>
          </dl>
          <i className="hover-box__point"></i>
        </div>
      </div>
    )
  }
}

export default Hoverbox
