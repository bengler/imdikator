import React, {Component, PropTypes} from 'react'

export default class App extends Component {
  static propTypes = {
    breadCrumbs: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string,
      })
    ),
    page: PropTypes.node
  }

  renderBreadCrumbs() {
    const {breadCrumbs} = this.props
    if (!breadCrumbs) {
      return null
    }
    return (
      <nav className="breadcrumbs">
        <ul className="t-no-list-styles breadcrumbs__list">
          <li key="/" className="breadcrumbs__list-item">
            <a href="/" className="breadcrumbs__link">Tall og statistikk</a>
            <span className="breadcrumbs__divider">/</span>
          </li>
          {breadCrumbs.map(crumb => (
            <li key={crumb.url} className="breadcrumbs__list-item">
              <a href={crumb.url} className="breadcrumbs__link">
                {crumb.title}
              </a>
              <span className="breadcrumbs__divider">/</span>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  render() {
    const {page: Page} = this.props
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
        <Page/>
      </div>
    )
  }
}
