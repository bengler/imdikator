import React, {Component} from 'react'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

export default class NotFoundPage extends Component {
  static propTypes = {
    route: ImdiPropTypes.route
  }

  render() {
    return (
      <div>
        Denne siden fant vi visst ikke
      </div>
    )
  }
}
