import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import BreadCrumbs from './BreadCrumbs'
import LoadingOverlay from '../elements/LoadingOverlay'

class App extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    router: ImdiPropTypes.router.isRequired,
    showLoadingOverlay: PropTypes.bool
  };

  static childContextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func,
    navigate: PropTypes.func,
  };

  getChildContext() {
    const {router} = this.props
    return {
      linkTo: router.makeLink,
      navigate: router.navigate,
      goTo: (...args) => {
        router.navigate(router.makeLink(...args))
      }
    }
  }

  render() {
    return (
      <div onKeyDown={this.giveArrowsAbilityToTab} onClick={this.giveArrowsAbilityToTab}>
        {this.props.showLoadingOverlay && <LoadingOverlay />}
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <BreadCrumbs />
              </div>
            </div>
          </div>
        </div>
        {this.props.component && <this.props.component />}
      </div>
    )
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    route: state.route,
    component: state.page,
    showLoadingOverlay: state.loadingState.isLoading
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)
