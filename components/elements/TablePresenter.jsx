import React, {PropTypes} from 'react'

/**
 * This is where the magic happens
 */
export default class TablePresenter {
  static propTypes = {
    title: PropTypes.string,
    data: PropTypes.object,
    chart: PropTypes.oneOf('foo', 'bar')
  }

  render() {
    const {title} = this.props
    return (
      <section className="feature feature--list">
        <div className="col-block-bleed feature__box">
          <div className="feature__content-wrapper">
            <h1 className="feature__prefix">{title}</h1>
          </div>
        </div>
      </section>
    )
  }
}
