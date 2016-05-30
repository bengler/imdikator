import React, {Component, PropTypes} from 'react'

/* global document */

import ReactDOM from 'react-dom'

function isDescendant(parent, child) {
  let node = child.parentNode
  while (node !== null) {
    if (node == parent) {
      return true
    }
    node = node.parentNode
  }
  return false
}

export default class Lightbox extends Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    onClose: PropTypes.func,
    onClickOutside: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {
    onClose() {},
    onClickOutside() {}
  };

  componentDidMount() {
    this.handleClickOutside = this.handleClickOutside.bind(this)
    document.body.addEventListener('click', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleClickOutside)
  }

  handleClickOutside(e) {
    if (!isDescendant(ReactDOM.findDOMNode(this), e.target)) {
      this.props.onClickOutside()
    }
  }

  render() {
    const {title, children, onClose, style, className} = this.props
    return (
      <div className={`lightbox ${className}`} style={style}>
        <div className="lightbox__backdrop"></div>
        <dialog open="open" className="lightbox__box">
          <i className="lightbox__point" />
          <button type="button" className="lightbox__close-button" onClick={onClose}>
            <i className="icon__close icon--red lightbox__close-button-icon" />
            <span className="t-only-screenreaders">Lukk</span>
          </button>
          <h4 className="lightbox__title">{title}</h4>
          {children}
        </dialog>
      </div>
    )
  }
}
