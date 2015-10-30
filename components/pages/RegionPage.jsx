import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {
  regionByPrefixedCode,
  isSimilarRegion
} from '../../lib/regionUtil'

import CardPageButtons from '../containers/CardPageButtons'
import RegionSummaryChart from '../containers/RegionSummaryChart'
import RegionChildList from '../elements/RegionChildList'
import RegionInfo from '../elements/RegionInfo'
import RegionSearch from '../containers/RegionSearch'
import chartQueries from '../../data/regionPageQueries'
import {_t} from '../../lib/translate'


class RegionPage extends Component {

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
    this.context.goTo('/steder/:region', {region: region.prefixedCode})
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
    const comparableRegionCodes = allRegions.filter(isSimilarRegion(region)).map(reg => reg.prefixedCode)
    const factSheetLink = this.context.linkTo('/steder/:region/fakta', {region: region.prefixedCode})

    return (
      <main className="page">
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header>
                  <h1>{region.name} {_t(region.type)}</h1>
                  <p className="ingress">Tall og statistikk om integrering i {_t(`the-${region.type}`)}</p>
                  <CardPageButtons />
                </header>
              </div>
            </div>
          </div>
        </div>

        <section className="page__section page__section--grey">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <h2 className="page__section-title">Oppsummering</h2>
                <div className="col-block-bleed--full-right col-block-bleed--inline-mobile">
                  <div className="row">
                    {chartQueries.map(chartQuery => {
                      const key = `${chartQuery.query.tableName}-${chartQuery.query.unit[0]}`
                      if (chartQuery.relevantFor.includes(region.type)) {
                        return (
                          <RegionSummaryChart key={key} comparableRegionCodes={comparableRegionCodes} region={region} chartQuery={chartQuery} />
                        )
                      }
                    })}
                  </div>
                </div>

                <section className="feature">
                  <h2 className="feature__title">Faktaark</h2>
                  <p>
                    Et dokument hvor et utdrag av alle nøkkeltallene fra {region.name} {_t(region.type)} er gjengitt.
                  </p>
                  <p>
                    <a href={factSheetLink} className="button button-">
                      <i className="icon__download icon--white"></i> Last ned faktaark
                    </a>
                  </p>
                </section>

              </div>
            </div>
          </div>
        </section>

        <div className="page__footer">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <section className="feature feature--white">
                  <h2 className="feature__title">{region.name}</h2>
                  <RegionInfo region={region} allRegions={allRegions} />
                  <div>
                    <span>Finn område: </span>
                    <RegionSearch onSelect={this.handleSelectRegion.bind(this)}/>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {
        allRegions.length
        && <div className="page__footer">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <section className="feature feature--white">
                  <RegionChildList region={region} allRegions={allRegions}/>
                </section>
              </div>
            </div>
          </div>
        </div>
        }
      </main>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let region
  if (state.allRegions) {
    const prefixedRegionCode = ownProps.route.params.region.split('-')[0].toUpperCase()
    region = regionByPrefixedCode(prefixedRegionCode, state.allRegions)
  }

  return {
    allRegions: state.allRegions,
    region: region
  }
}

export default connect(mapStateToProps)(RegionPage)
