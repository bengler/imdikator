import React, {Component} from 'react'

export default class LoadingOverlay extends Component {

  // TO-DO: Accessability

  render() {
    return (
      <div className="overlay">
        <div className="overlay__inner">
          <p className="ingress"><i className="loading-indicator" /> Laster...</p>
        </div>
      </div>
    )
  }
}
