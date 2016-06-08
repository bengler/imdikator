import React, {Component, PropTypes} from 'react'
import {_t} from '../../lib/translate'
import {capitalize} from 'lodash'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

export default class RegionInfo extends Component {

  static propTypes = {
    region: ImdiPropTypes.region,
    municipality: ImdiPropTypes.region,
    county: ImdiPropTypes.region,
    commerceRegion: ImdiPropTypes.region,
    createLinkToRegion: PropTypes.func.isRequired,
    createLinkToSimilarRegion: PropTypes.func.isRequired
  };

  render() {
    const {region, municipality, county, commerceRegion, createLinkToRegion, createLinkToSimilarRegion} = this.props
    return (
      <div>
        <p>
          <span>Dette er tall og statistikk fra <a href={createLinkToRegion(region)}>{region.name}
            {region.name == 'Norge' ? '' : ` ${_t(region.type)}`}</a>. </span>

          {region.type == 'commerceRegion' && (
            <span>
            Kommuner i en næringsregion har en interkommunal avtale om å samarbeide.
            </span>
          )}

          {region.type == 'borough' && (
            <span>
              {capitalize(_t(`the-${region.type}`))} {' ligger i '}
              <a href={createLinkToRegion(municipality)}>
                {municipality.name}
              </a>
              {' kommune og er en del av '}
              <a href={createLinkToRegion(commerceRegion)}>
                {commerceRegion.name}
              </a>.
            </span>
          )}

          {region.type == 'municipality' && county && (
            <span>
              {capitalize(_t(`the-${region.type}`))} {' ligger i '}
              <a href={createLinkToRegion(county)}>
                {county.name}
              </a>
               {' fylke og er en del av næringsregionen '}
              <a href={createLinkToRegion(commerceRegion)}>
                {commerceRegion.name}
              </a>.
            </span>
          )}

          {region.type == 'municipality' && (
            <span>
              {' Se '}
              <a href={createLinkToSimilarRegion(region)}>
                andre {_t(`several-${region.type}`)} som ligner på {region.name}
              </a>
              {' når det kommer til folketall, innvandrerandel og flyktningsandel.'}
            </span>
            )}
        </p>
      </div>
    )
  }
}
