import React, {Component, PropTypes} from 'react'
import {prefixifyRegion} from '../../../lib/regionUtil'
import RegionSearch from '../../containers/RegionSearchContainer'
import {trackRegionChanged} from '../../../actions/tracking'
import Lightbox from '../Lightbox'
import cx from 'classnames'
import * as ImdiPropTypes from '../../proptypes/ImdiPropTypes'

/* RegionChanger
 * Used in cards to quickly change region viewed to another
 * -> After reload, takes the user back to the same card
*/
export default class RegionChanger extends Component {
  static propTypes = {
    region: ImdiPropTypes.region.isRequired
  };
  constructor(props) {
    super()
    this.state = {
      isRegionChangerOpen: false
    }
  }

  static contextTypes = {
    navigate: PropTypes.func
  };

  // if (most likely) someone clicked a chart link in the embed version (EmbeddedChartContainer),
  // we want to have the place search open by default- which the following does.
  componentDidMount() {
    const shouldBeOpen = sessionStorage.getItem('imdi-open-search-box-default') || false
    if (shouldBeOpen) sessionStorage.removeItem('imdi-open-search-box-default')
    this.state.isRegionChangerOpen = shouldBeOpen
  }

  // Go to the same URL, but for the selected region
  toggleLightBox(region) {
    this.setState({
      isRegionChangerOpen: !this.state.isRegionChangerOpen
    })
  }

  // Go to the same URL, but for the selected region
  handleSelectRegion(region) {
    const currentUrl = window.location.href
    const newRegion = prefixifyRegion(region)
    const oldRegion = currentUrl.match('steder/(.+?)/')

    trackRegionChanged()

    this.context.navigate(currentUrl.replace(oldRegion[1], newRegion), {
      keepScrollPosition: true,
    })
  }

  renderRegionPickerLightbox() {
    return (
      <Lightbox
        title={`sted: ${this.props.region.name}`}
        onClose={this.toggleLightBox.bind(this)}
        onClickOutside={this.toggleLightBox.bind(this)}
      >
        <div className="fieldset" style={{maxWidth: '450px'}}>
          <label>
            <span className="label legend">Endre sted</span>
            <div className="search search--autocomplete">
              <RegionSearch onSelect={this.handleSelectRegion.bind(this)} placeholder="Kommune/bydel/fylke/næringsregion" />
            </div>
          </label>
          <p className="text--small">
            Du kan se tall for alle kommuner, fylker, næringsregioner og bydeler. Endring av sted vil gjelde for alle figurer på siden.
          </p>
        </div>
      </Lightbox>
    )
  }

  render() {
    const {
      isRegionChangerOpen
    } = this.state

    const {
      region,
    } = this.props

    const buttonClasses = cx({
      'subtle-select__button': true,
      'subtle-select__button--location': true,
      'subtle-select__button--expanded': isRegionChangerOpen
    })

    return (
      <div>
        <div className="subtle-select">
          <label>
            <span className="subtle-select__label">
            Sted:
            </span>
            <button
              type="button"
              className={buttonClasses}
              onClick={this.toggleLightBox.bind(this)}
            >
              {region.name}
            </button>
          </label>
        </div>

        {isRegionChangerOpen && this.renderRegionPickerLightbox()}
      </div>
    )
  }
}
