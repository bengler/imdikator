import React, {Component, PropTypes} from 'react'
import Search from '../containers/Search'

export default class RegionPage extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  render() {
    return (
      <div>
        Finn ditt område: <Search/>

        <p>Test: <a href="/steder/k0301-Oslo/levekaar/gjennomsnittsinntekt">/steder/k0301-Oslo/levekaar/gjennomsnittsinntekt</a></p>

        <br/>
        <br/>
      </div>
    )
  }
}
