import React, {Component} from 'react'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'

export default class NotFoundPage extends Component {
  static propTypes = {
    route: ImdiPropTypes.route
  };

  render() {
    return (
      <main className="page">
        <div className="page__content">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <header>
                  <h1>Siden ble ikke funnet</h1>
                </header>
                <div className="ingress">Kanskje den har flyttet til Norge og fått seg et bedre hjem i en kommune?</div>
                <RegionQuickSwitch/>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
