import React, {Component, PropTypes} from 'react'
import RegionSearch from '../containers/RegionSearch'
import {prefixify} from '../../lib/regionUtil'

export default class RegionPage extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSelectRegion(region) {
    this.context.goTo('/steder/:region', {region: prefixify(region)})
  }

  render() {
    return (
      <div>
        Finn ditt område:

        <RegionSearch onSelect={this.handleSelectRegion.bind(this)}/>

        <p>Test: <a href="/steder/k0301-Oslo/levekaar/gjennomsnittsinntekt">/steder/k0301-Oslo/levekaar/gjennomsnittsinntekt</a></p>

        <br/>
        <br/>
      </div>
    )
  }
}
