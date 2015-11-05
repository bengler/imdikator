import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class CardMetadata extends Component {
  static propTypes = {
    description: PropTypes.string,
    terminology: PropTypes.string,
    source: PropTypes.string,
    measuredAt: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      expanded: false
    }
  }

  handleClick(e) {
    e.preventDefault()
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {description, terminology, source, measuredAt} = this.props

    const buttonClasses = cx({
      toggle__button: true, // eslint-disable-line camelcase
      'toggle__button--expanded': this.state.expanded
    })

    const sectionClases = cx({
      toggle__section: true, // eslint-disable-line camelcase
      'toggle__section--expanded': this.state.expanded
    })

    return (
      <div className="graph__about">
        <div className="toggle toggle--light t-no-margin">
          <div className="toggle toggle--light t-no-margin">
            <a onClick={this.handleClick.bind(this)} href="#" className={buttonClasses}>
              <span className="toggle__caption--contracted">
                Veiledning og kilder
              </span>
              <span className="toggle__caption--expanded">Skjul veiledning og kilder</span>
              <i className="icon__arrow-down toggle__icon"/>
            </a>
          </div>

          {this.state.expanded
            && <div className={sectionClases}>
            <h4 className="h2">Veiledning og kilder</h4>
            <h5 className="h3">Sammendrag</h5>
            <p>{description}</p>
            <h5 className="h3">Begrepsforklaring</h5>
            <p>{terminology}</p>
            <h5 className="h3">Kilder</h5>
            <p>{source}, målt: {measuredAt}</p>
          </div>
            }
        </div>
      </div>
    )
  }
}
