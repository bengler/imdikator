

import React, {Component, PropTypes} from 'react'

export default class CardMetadata extends Component {
  static propTypes = {
    metadata: PropTypes.object
  }

  render() {
    const {metadata} = this.props
    const {description, terminology, source, measuredAt} = metadata

    return (
      <div className="graph__about">
        <div className="toggle toggle--light t-no-margin">
            <a href="#" className="toggle__button"><span className="toggle__caption--contracted"> Veiledning og kilder</span><span className="toggle__caption--expanded">Skjul veiledning og kilder</span> <i className="icon__arrow-down toggle__icon"></i></a>
        </div>

        <div>
          <h4 className="h2">Veiledning og kilder</h4>
          <h5 className="h3">Sammendrag</h5>
          <p>{description}</p>
          <h5 className="h3">Begrepsforklaring</h5>
          <p>{terminology}</p>
          <h5 className="h3">Kilder</h5>
          <p>{source}, målt: {measuredAt}</p>
        </div>
      </div>
    )
  }
}
