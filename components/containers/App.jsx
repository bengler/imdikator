import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {navigate} from '../../actions'

class App extends Component {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func
  }

  render() {
    // Injected by connect() call:
    const {route} = this.props
    return <route.handler route={route}/>
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    route: state.route
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)
