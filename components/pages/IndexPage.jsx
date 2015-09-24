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
        <br/>
        <br/>
      </div>
    )
  }
}
