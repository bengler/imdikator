import React, {Component, PropTypes} from 'react'
import {fetchVariableDefinitions} from '../../actions/variableDefinitions'
import cx from 'classnames'
import {connect} from 'react-redux'
import {trackHelpOpen} from '../../actions/tracking'

class CardMetadata extends Component {
  static propTypes = {
    metadata: PropTypes.shape({
      description: PropTypes.string,
      terminology: PropTypes.string,
      source: PropTypes.string,
      measuredAt: PropTypes.string
    }),
    dimensions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      variables: PropTypes.oneOf([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
      ])
    })),
    variableDefinitions: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        dimension: PropTypes.string,
        dimensionDescription: PropTypes.string,
        variableDescription: PropTypes.string
      }))
    }),
    dispatch: PropTypes.func
  };

  constructor() {
    super()
    this.state = {
      expanded: false
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchVariableDefinitions())
  }

  handleClick(e) {
    e.preventDefault()
    if (!this.state.expanded) {
      this.props.dispatch(trackHelpOpen())
    }
    this.setState({expanded: !this.state.expanded})
    return false
  }

  renderVariableDefinitions() {
    const {dimensions, variableDefinitions} = this.props

    return dimensions.map(findDimensionDefinition).map((definition, i) => (
      <div key={i}>
        <h4>{definition.variableDescription}</h4>
        <p dangerouslySetInnerHTML={{__html: definition.dimensionDescription}} />
      </div>
    ))

    function findDimensionDefinition(dimension) {
      return variableDefinitions.items.find(definition => dimension.name === definition.dimension)
    }
  }

  render() {
    const {metadata} = this.props

    const buttonClasses = cx({
      'toggle__button': true, // eslint-disable-line camelcase
      'toggle__button--expanded': this.state.expanded
    })

    const sectionClases = cx({
      'toggle__section': true, // eslint-disable-line camelcase
      'toggle__section--expanded': this.state.expanded
    })

    return (
      <div className="graph__about">
        <div className="toggle toggle--light t-no-margin">
          {metadata.source && metadata.measuredAt && <p>{metadata.source}, målt: {metadata.measuredAt}</p>}

          <a onClick={this.handleClick.bind(this)} href="javascript:" className={buttonClasses} aria-expanded={this.state.expanded} role="button">{// eslint-disable-line no-script-url, max-len
}
            <span className="toggle__caption--contracted">
              Bakgrunn for tallene
            </span>
            <span className="toggle__caption--expanded">Skjul bakgrunn for tallene</span>
            <i className="icon__arrow-down toggle__icon" />
          </a>

          {this.state.expanded && (
            <div className={sectionClases}>
              <h4 className="h2">Bakgrunn for tallene</h4>
              <h5 className="h3">Sammendrag</h5>
              <div dangerouslySetInnerHTML={{__html: metadata.description}} />
              <h5 className="h3">Begrepsforklaring</h5>
              {metadata.terminology && <div dangerouslySetInnerHTML={{__html: metadata.terminology}} />}
              {this.renderVariableDefinitions()}
              <h5 className="h3">Kilder</h5>
              <p>Kilde: {metadata.source}, målt: {metadata.measuredAt}</p>
              {
                metadata.updatedAt && metadata.updatedAt !== ''
                && <p>Oppdateres neste gang: {metadata.updatedAt}</p>
              }

            </div>
          )}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {

  const variableDefinitions = state.variableDefinitions

  return {
    variableDefinitions
  }
}

export default connect(mapStateToProps)(CardMetadata)
