import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {
  comparableRegions,
  //allCounties,
  norway
} from '../../lib/regionUtil'
import RegionSummaryChart from '../containers/RegionSummaryChart'
import RegionChildList from '../elements/RegionChildList'
import RegionSearch from '../containers/RegionSearch'
import chartQueries from '../../data/regionPageQueries'


class IndexPage extends Component {

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
    const region = norway
    if (!allRegions) {
      return (
        <div className="col--main">
          <span>Loading regions...</span>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </div>
      )
    }
    const comparableRegionCodes = comparableRegions(region, allRegions).map(reg => reg.prefixedCode)

    return (
      <main className="page">
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header>
                  <h1>Norge</h1>
                  <p className="ingress">Tall og statistikk over integreringen i hele landet</p>
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
                      const key = `${chartQuery.query.tableName}-${chartQuery.query.unit}`
                      return (
                        <RegionSummaryChart key={key} comparableRegionCodes={comparableRegionCodes} region={region} chartQuery={chartQuery} />
                      )
                    })}
                  </div>
                </div>

                <section className="feature">
                  <h2 className="feature__title">Faktaark</h2>
                  <p>
                    Et dokument hvor et utdrag av nøkkeltallene for hele landet er gjengitt.
                  </p>
                  <p>
                    <a href="#" className="button button-">
                      <i className="icon__download icon--white"></i> Last ned faktaark (PDF)
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
                  <div>
                    <span>Finn område: </span>
                    <RegionSearch onSelect={this.handleSelectRegion.bind(this)}/>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        <div className="page__footer">
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
      </main>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    allRegions: state.allRegions
  }
}

export default connect(mapStateToProps)(IndexPage)
