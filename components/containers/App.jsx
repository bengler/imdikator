import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class App extends Component {
  static propTypes = {
    route: PropTypes.object,
    router: PropTypes.object,
    dispatch: PropTypes.func
  }

  static childContextTypes = {
    linkTo: PropTypes.func
  }

  getChildContext() {
    return {
      linkTo: this.props.router.makeLink
    }
  }

  render() {
    // Injected by connect() call:
    const {route} = this.props
    return <route.handler dispatch={this.props.dispatch} route={route}/>
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
