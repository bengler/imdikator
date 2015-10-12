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

  renderBreadCrumbs() {
    if (!this.props.route) {
      return null
    }
    const url = this.props.route.url
    const segments = url.split('/').slice(1).filter(Boolean)
    return (
      <nav className="breadcrumbs">
        <ul className="t-no-list-styles breadcrumbs__list">
          <li key="/" className="breadcrumbs__list-item">
            <a href="/" className="breadcrumbs__link">Tall og statistikk</a>
            <span className="breadcrumbs__divider">/</span>
          </li>
          {segments.map((segment, i) => {
            return (
              <li key={segment + i} className="breadcrumbs__list-item">
                <a href={'/' + segments.slice(0, i + 1).join('/')} className="breadcrumbs__link">
                  {segment}
                </a>
                <span className="breadcrumbs__divider">/</span>
              </li>
            )
          })}
        </ul>
      </nav>
    )
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
                {this.renderBreadCrumbs()}
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
