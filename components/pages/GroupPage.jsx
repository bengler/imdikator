import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {fetchGroup} from '../../actions/groups'
import {fetchRegionByCode} from '../../actions/region'

class GroupPage extends Component {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func,
    group: PropTypes.object,
    region: PropTypes.object,
    cards: PropTypes.array
  }

  componentWillMount() {
    const {route, dispatch} = this.props
    const [regionCode, regionName] = route.params.region.split('-')
    const {group, cardName} = route.params
    // This may be hooked up at a higher level
    dispatch(fetchGroup(group))
    dispatch(fetchRegionByCode(regionCode))
  }

  render() {
    const {group, region} = this.props
    if (!group || !region) {
      return <div>Loading...</div>
    }
    const currentCard = this.props.route.params.cardName
    return (
      <div>
        <h2>{group.title} i {region.name}</h2>
        {group.cards.map(card => {
          return (
            <div style={{border: '1px dotted #c0c0c0', marginBottom: 10}}>
              <h3>Card: {card.title} {currentCard == card.name && 'Expanded!'}</h3>
              <a href={card.name}>Expand</a>
            </div>
          )
        })}
      </div>
    )
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    group: state.group,
    region: state.region
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(GroupPage)
