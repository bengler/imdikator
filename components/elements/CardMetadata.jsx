
import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class CardMetadata extends Component {
  static propTypes = {
    metadata: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      expanded: false
    }
  }

  handleClick() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {metadata} = this.props
    const {description, terminology, source, measuredAt} = metadata

    const buttonClasses = cx({
      'toggle__button': true,
      'toggle__button--expanded': this.state.expanded
    })

    const sectionClases = cx({
      'toggle__section': true,
      'toggle__section--expanded': this.state.expanded
    })


    return (
      <div className="graph__about">  
        <div className="toggle toggle--light t-no-margin">
          <div className="toggle toggle--light t-no-margin">
              <a onClick={this.handleClick.bind(this)} href="#" className={buttonClasses}><span className="toggle__caption--contracted"> Veiledning og kilder</span><span className="toggle__caption--expanded">Skjul veiledning og kilder</span> <i className="icon__arrow-down toggle__icon"></i></a>
          </div>

          {
            this.state.expanded &&
            <div className={sectionClases}>
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
