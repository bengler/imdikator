import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {isSimilarRegion, parentRegionByType} from '../../lib/regionUtil'
import {_t} from '../../lib/translate'
import capitalize from 'lodash.capitalize'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'


class SimilarRegionsPage extends Component {

  static propTypes = {
    currentRegion: ImdiPropTypes.region.isRequired,
    similarRegions: PropTypes.arrayOf(ImdiPropTypes.region),
    parentRegion: ImdiPropTypes.region,
    dispatch: PropTypes.func
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  renderHeader() {
    const {currentRegion} = this.props
    const several = capitalize(_t(`several-${currentRegion.type}`))

    switch (currentRegion.type) {

      case 'borough':
        return <h2>{several} i samme kommune som ${currentRegion.name}`</h2>

      case 'municipality':
        return [
          (<h2>{several} som ligner på {currentRegion.name}</h2>),
          (<div className="ingress">
            De {_t(`those-${currentRegion.type}`)} som er nærmest {currentRegion.name} mhp.
            befolkningsstørrelse, innvandrerandel og flyktningsandel er mest naturlig å sammenligne med.`
          </div>)
        ]

      case 'county':
        return <h2>Fylker å sammenligne {currentRegion.name} med</h2>

      case 'commerceRegion':
        return <h2>{several} i samme fylke som {currentRegion.name}</h2>

      default:
        throw new Error(`Invalid region type ${currentRegion.type}`)
    }
  }
  render() {
    const {similarRegions, currentRegion, parentRegion} = this.props
    const {linkTo} = this.context

    if (!currentRegion) {
      return null
    }

    return (
      <main className="page">
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                {this.renderHeader()}
              </div>
            </div>
            <div className="row">
              <div className="col--main">
                <a href={linkTo('/steder/:region', {region: currentRegion.prefixedCode})} className="button">
                  Gå til oppsummeringen for å sammenligne
                </a>
              </div>
            </div>
          </div>

          <div className="page__footer">
            <div className="wrapper">
              <div className="row">
                <div className="col--main">
                  <div className="feature">
                    {currentRegion.type == 'borough' && (
                      <h2 className="feature__section-title">
                        De andre {_t(`those-${currentRegion.type}`)} i {parentRegion.name}
                      </h2>
                    )}
                    {currentRegion.type == 'municipality' && (
                      <h2 className="feature__section-title">
                        {capitalize(_t(`several-${currentRegion.type}`))} i prioritert rekkefølge
                      </h2>
                    )}

                    {currentRegion.type == 'county' && <h2 className="feature__section-title">De andre fylkene i Norge</h2>}

                    <nav role="navigation" className="navigation">
                      <ul className="t-no-list-styles">
                        {similarRegions.map(similarRegion => {
                          return (
                            <li key={similarRegion.code}>
                              <a
                                className="navigation__link navigation__link--primary"
                                href={this.context.linkTo('/steder/:region', {region: similarRegion.prefixedCode})}
                              >
                                {similarRegion.name}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

function mapStateToProps(state, ownProps) {

  const {allRegions, currentRegion} = state

  const similarRegions = allRegions.filter(isSimilarRegion(currentRegion))

  return {
    similarRegions: similarRegions,
    currentRegion: currentRegion,
    parentRegion: parentRegionByType('municipality', currentRegion.municipalityCode, allRegions)
  }
}

export default connect(mapStateToProps)(SimilarRegionsPage)
