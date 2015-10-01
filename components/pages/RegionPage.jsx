import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {split, typeForPrefix, regionByCode} from '../../lib/regionUtil'
import {_t} from '../../lib/translate'
import CardPageButtons from '../containers/CardPageButtons'
import RegionChartTest from '../containers/RegionChartTest'
import RegionChildList from '../elements/RegionChildList'
import RegionInfo from '../elements/RegionInfo'
import Search from '../containers/RegionSearch'


class RegionPage extends Component {

  static propTypes = {
    route: PropTypes.object,
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


  render() {
    const allRegions = this.props.allRegions
    if (allRegions.length < 1) {
      return (
        <div className="col--main">
          <span>Loading regions...</span>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </div>
      )
    }
    const [regionTypePrefix, regionCode] = split(this.props.route.params.region.split('-')[0])
    const assumedRegionType = typeForPrefix(regionTypePrefix)
    const region = regionByCode(regionCode, assumedRegionType, allRegions)

    return (
      <div className="col--main">

        <header>
					<h1>{region.name} {_t(region.type)}</h1>
					<p className="ingress">Tall og statistikk over integreringen i {_t('the-' + region.type)}</p>
          <CardPageButtons />
				</header>

        <div className="page__section page__section--grey">
          <section className="feature">
            <h2 className="feature__title">Oppsummering</h2>
            <p>Charts and stuff goes here</p>
            <div className="col--half col--flow">
              <RegionChartTest regionCode={region.code}/>
            </div>
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
            <span>Finn område: </span><Search/>
          </div>
				</section>

        <section className="feature feature--white">
          <RegionChildList region={region} allRegions={allRegions}/>
        </section>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    allRegions: state.allRegions
  }
}

export default connect(mapStateToProps)(RegionPage)
