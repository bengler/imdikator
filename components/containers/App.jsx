import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadTables} from '../../actions/tables'

class App extends Component {
  static propTypes = {
    route: PropTypes.object,
    router: PropTypes.object,
    dispatch: PropTypes.func,
    cardPages: PropTypes.array
  }

  static childContextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  getChildContext() {
    const {router} = this.props
    return {
      linkTo: router.makeLink,
      goTo: (...args) => {
        router.navigate(router.makeLink(...args))
      }
    }
  }

  componentWillMount() {
    this.props.dispatch(loadTables())
  }

  render() {
    // Injected by connect() call:
    const {route} = this.props
    return (
      <div>
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <nav className="breadcrumbs">
                  <ul className="t-no-list-styles breadcrumbs__list">
                    <li className="breadcrumbs__list-item">
                      <a className="breadcrumbs__link">
                        Breadcrumbs
                      </a>
                      <span className="breadcrumbs__divider">/</span>
                    </li>
                    <li className="breadcrumbs__list-item">
                      <a className="breadcrumbs__link">
                        go
                      </a>
                      <span className="breadcrumbs__divider">/</span>
                    </li>
                    <li className="breadcrumbs__list-item">
                      <a className="breadcrumbs__link">
                        here
                      </a>
                      <span className="breadcrumbs__divider">/</span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <route.handler dispatch={this.props.dispatch} route={route}/>
      </div>
    )
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    route: state.route,
    cardPages: state.cardPages
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)
