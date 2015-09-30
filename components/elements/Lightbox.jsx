import React, {Component, PropTypes} from 'react'

export default class Lightbox extends Component {
  static propTypes = {
    children: PropTypes.element,
    title: PropTypes.string,
    onClose: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  render() {
    const {title, children, onClose, style, className} = this.props
    return (
      <div className={`lightbox ${className}`} style={style}>
        <div className="lightbox__backdrop"></div>
        <section className="lightbox__box">
          <i className="lightbox__point"/>
          <button type="button" className="lightbox__close-button" onClick={onClose}>
            <i className="icon__close icon--red lightbox__close-button-icon"/>
            <span className="t-only-screenreaders">Lukk</span>
          </button>
          <h6 className="lightbox__title">{title}</h6>
          {children}
        </section>
      </div>
    )
  }
}
