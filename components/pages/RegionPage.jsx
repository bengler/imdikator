import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadRegionByCode} from '../../actions/region'
import translations from '../../data/translations'

export default class RegionPage extends Component {

  static propTypes = {
    route: PropTypes.object,
    region: PropTypes.object,
    dispatch: PropTypes.func
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }


  componentWillMount() {
    const regionCode = this.props.route.params.region.split('-')[0]
    this.props.dispatch(loadRegionByCode(regionCode))
  }


  render() {
    const region = this.props.region
    if (!region) {
      return <span>Loading region {this.props.route.params.region}</span>
    }
    return (
      <div>
        RegionPage
        <pre>{JSON.stringify(this.props.route, null, 2)}</pre>
        <p><a href="/"> Go back</a></p>

        <header>
					<h1>{region.name} {translations[region.type]}</h1>
					<p className="ingress">Tall og statistikk over integreringen i {translations['the-' + region.type]}.</p>
				</header>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    region: state.region
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(RegionPage)
