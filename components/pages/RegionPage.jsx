import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {prefixify, split, typeForPrefix, regionByCode} from '../../lib/regionUtil'
import {_t} from '../../lib/translate'
import CardPageButtons from '../containers/CardPageButtons'
import RegionChart from '../containers/RegionChart'
import RegionChildList from '../elements/RegionChildList'
import RegionInfo from '../elements/RegionInfo'
import RegionSearch from '../containers/RegionSearch'
import chartQueries from '../../data/regionPageQueries'


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
    this.context.goTo('/steder/:region', {region: prefixify(region)})
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

    return (
      <div className="col--main">

        <header>
					<h1>{region.name} {_t(region.type)}</h1>
					<p className="ingress">Tall og statistikk over integreringen i {_t(`the-${region.type}`)}</p>
          <CardPageButtons />
				</header>

        <div className="page__section page__section--grey">

          <section className="feature">
            <h2 className="feature__title">Oppsummering</h2>
            {chartQueries.map(chartQuery => {
              const key = `${chartQuery.query.tableName}-${chartQuery.query.unit}`
              return (
                <div key={key} className="chart col--half col--flow">
                  <h3>{chartQuery.title}</h3>
                  <p className="indicator__secondary">{chartQuery.subTitle}</p>
                  <RegionChart region={region} query={chartQuery.query} />
                </div>
              )
            })}
          </section>

          <section className="feature">
            <h2 className="feature__title">Faktaark</h2>
            <p>Et dokument hvor et utdrag av alle nøkkeltallene fra {region.name} {_t(region.type)} er gjengitt.</p>
            <p><a href="#" className="button button-"><i className="icon__download icon--white"></i> Last ned faktaark (PDF)</a></p>
          </section>

        </div>

				<section className="feature feature--white">
					<h2 className="feature__title">{region.name}</h2>
          <RegionInfo region={region} allRegions={allRegions} />
          <div>
            <span>Finn område: </span>
            <RegionSearch onSelect={this.handleSelectRegion.bind(this)}/>
          </div>
				</section>

        <section className="feature feature--white">
          <RegionChildList region={region} allRegions={allRegions}/>
        </section>

      </div>
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

export default connect(mapStateToProps)(RegionPage)
