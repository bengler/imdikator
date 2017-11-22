import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {queryToOptions, describeChart} from '../../lib/chartDescriber'
import {getHeaderKey} from '../../lib/regionUtil'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class ChartDescriptionContainer extends Component {
  static propTypes = {
    query: ImdiPropTypes.query.isRequired,
    card: ImdiPropTypes.card.isRequired,
    region: ImdiPropTypes.region.isRequired,
    headerGroups: PropTypes.array,
    description: PropTypes.string,
    setDescription: PropTypes.function,
    embedded: PropTypes.bool
  }

  render() {
    const classes = this.props.embedded ? 'graph__description embed' : 'graph__description'
    return (
      <div className={classes}>
        <p>
          {this.props.description}
        </p>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {

  const {query, card, region, headerGroups} = ownProps

  const {allRegions} = state
  const regionHeaderKey = getHeaderKey(region)
  const headerGroup = headerGroups.find(group => {
    return group.hasOwnProperty(regionHeaderKey) && query.dimensions.every(dim => group.hasOwnProperty(dim.name))
  })

  const graphDescription = describeChart(queryToOptions(query, card, headerGroup, allRegions))

  return {
    description: graphDescription
  }
}

export default connect(mapStateToProps)(ChartDescriptionContainer)
