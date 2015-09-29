import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {prefixify} from '../../lib/regionUtil'
import translations from '../../data/translations'
import CardPageButtons from '../containers/CardPageButtons'
import Search from '../containers/Search'


function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}


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

  regionByCode(code, commerceRegion = false) {
    if (commerceRegion) {
      return this.props.allRegions.filter(region => (region.code == code) && region.type == 'commerceRegion')[0]
    }
    return this.props.allRegions.filter(region => (region.code == code) && region.type != 'commerceRegion')[0]
  }

  render() {
    if (this.props.allRegions.length < 1) {
      return (
        <div className="col--main">
          <span>Loading regions...</span>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </div>
      )
    }
    const regionType = this.props.route.params.region.charAt(0).toLowerCase()
    const regionCode = this.props.route.params.region.split('-')[0].replace(/\w/, '')
    const region = this.regionByCode(regionCode, regionType == 'n') // houston, we have a commerceRegion
    const municipality = region.municipalityCode ? this.regionByCode(region.municipalityCode) : null
    const county = region.countyCode ? this.regionByCode(region.countyCode) : null
    const commerceRegionCode = region.commerceRegionCode || (municipality ? municipality.commerceRegionCode : null)
    const commerceRegion = commerceRegionCode ? this.regionByCode(commerceRegionCode, true) : null

    return (
      <div className="col--main">

        <header>
					<h1>{region.name} {translations[region.type]}</h1>
					<p className="ingress">Tall og statistikk over integreringen i {translations['the-' + region.type]}</p>
          <CardPageButtons />
				</header>

				<section className="feature feature--white">
					<h2 className="feature__title">{region.name}</h2>
					<p>
            <span>Dette er tall og statistikk fra <a href="#oppsummert">{region.name}</a>. </span>


            {region.type == 'borough'
              && <span>{capitalize(translations['the-' + region.type])} ligger i <a href={this.context.linkTo('/steder/:region', {region: prefixify(municipality)})}>{municipality.name}</a> kommune og er en del av <a href={this.context.linkTo('/steder/:region', {region: prefixify(commerceRegion)})}>{commerceRegion.name}</a>.</span>
            }

            {region.type == 'municipality'
              && county
              && <span>{capitalize(translations['the-' + region.type])} ligger i <a href={this.context.linkTo('/steder/:region', {region: prefixify(county)})}>{county.name}</a> fylke og er en del av <a href={this.context.linkTo('/steder/:region', {region: prefixify(commerceRegion)})}>{commerceRegion.name}</a>.</span>
            }

            <span> Se <a href="">andre {translations['several-' + region.type]} som ligner på {region.name}</a> når det kommer til folketall, innvandrerandel og flyktningsandel.</span>
          </p>
          <div>
            <span>Finn område: </span><Search/>
          </div>
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
