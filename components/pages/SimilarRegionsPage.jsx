import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {
  prefixifyRegion,
  split,
  typeForPrefix,
  regionByCode,
  comparableRegions,
  parentRegion
} from '../../lib/regionUtil'
import {_t} from '../../lib/translate'

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}


class SimilarRegionsPage extends Component {

  static propTypes = {
    route: PropTypes.object,
    region: PropTypes.object,
    allRegions: PropTypes.array,
    dispatch: PropTypes.func
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    this.props.dispatch(loadAllRegions())
  }

  handleSelectRegion(region) {
    this.context.goTo('/steder/:region', {region: prefixifyRegion(region)})
  }


  render() {
    const allRegions = this.props.allRegions
    const region = this.props.region
    if (!region) {
      return (
        <div className="col--main">
          <span>Loading regions...</span>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </div>
      )
    }
    const similarRegions = comparableRegions(region, allRegions)

    return (
      <main className="page">
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                {region.type == 'borough'
                  && <header>
                    <h1>{capitalize(_t(`several-${region.type}`))} i samme kommune som {region.name}</h1>
                  </header>
                }
                {region.type == 'municipality'
                  && <header>
                    <h1>{capitalize(_t(`several-${region.type}`))} som ligner på {region.name}</h1>
                    <div className="ingress">
                      De {_t('those-' + region.type)} som er nærmest {region.name} på befolkningsstørrelse, innvandrerandel og flyktningsandel er mest naturlig å sammenlikne med.
                    </div>
                  </header>
                }
                {region.type == 'county'
                  && <header>
                    <h1>Fylker å sammenligne {region.name} med</h1>
                  </header>
                }
                {region.type == 'commerceRegion'
                  && <header>
                    <h1>{capitalize(_t(`several-${region.type}`))} i samme fylke som {region.name}</h1>
                  </header>
                }
              </div>
            </div>
            <div className="row">
              <div className="col--main">
                <a href={this.context.linkTo('/steder/:region', {region: prefixifyRegion(region)})} className="button">Gå til grafene for å sammenligne</a>
              </div>
            </div>
          </div>

          <div className="page__footer">
            <div className="wrapper">
              <div className="row">
                <div className="col--main">
                  <div className="feature">
                    {region.type == 'borough'
                      && <h2 className="feature__section-title">De andre {_t(`those-${region.type}`)} i {parentRegion('municipality', region.municipalityCode, allRegions).name}</h2>
                    }
                    {region.type == 'municipality'
                      && <h2 className="feature__section-title">{capitalize(_t(`several-${region.type}`))} i prioritert rekkefølge</h2>
                    }
                    {region.type == 'county'
                      && <h2 className="feature__section-title">De andre fylkene i Norge</h2>
                    }

                    <nav role="navigation" className="navigation">
                      <ul className="t-no-list-styles">

                        {similarRegions.map(similarRegion => {
                          return (
                          <li key={similarRegion.code}>
                            <a className="navigation__link navigation__link--primary" href={this.context.linkTo('/steder/:region', {region: prefixifyRegion(similarRegion)})}>{similarRegion.name}</a>
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
  let region
  if (state.allRegions) {
    const [regionTypePrefix, regionCode] = split(ownProps.route.params.region.split('-')[0])
    const regionType = typeForPrefix(regionTypePrefix)
    region = regionByCode(regionCode, regionType, state.allRegions)
  }

  return {
    allRegions: state.allRegions,
    region: region
  }
}

export default connect(mapStateToProps)(SimilarRegionsPage)
