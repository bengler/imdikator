import React, {Component, PropTypes} from 'react'
import Lightbox from '../../elements/Lightbox'
import ToggleButtonList from '../../elements/ToggleButtonList'
import RegionSearch from '../../containers/RegionSearch'
import {_t} from '../../../lib/translate'

const RECOMMENDED_SIMILAR_REGIONS = [
  {name: 'Larvik'},
  {name: 'Sandefjord'}
]

const RECOMMENDED_AVERAGE_REGIONS = [
  {name: 'Norge'},
  {name: 'Næringsregion vestfold'}
]


export default class ToggleButtons extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      open: true,
      selectedSimilarRegions: RECOMMENDED_SIMILAR_REGIONS,
      selectedAverageRegions: RECOMMENDED_AVERAGE_REGIONS,
      selectedOtherRegions: []
    }
  }

  handleSimilarRegionsChange(newValue) {
    this.setState({selectedSimilarRegions: newValue})
  }

  handleAverageRegionsChange(newValue) {
    this.setState({selectedAverageRegions: newValue})
  }

  handleOtherRegionsChange(newValue) {
    this.setState({selectedOtherRegions: newValue})
  }

  addOtherRegion(region) {
    this.setState({selectedOtherRegions: this.state.selectedOtherRegions.concat(region)})
  }

  render() {
    const {open, selectedSimilarRegions, selectedAverageRegions, selectedOtherRegions} = this.state

    if (!open) {
      return <button onClick={() => this.setState({open: true})}>Open</button>
    }

    return (
      <Lightbox title="Legg til sammenlikning" onClose={() => this.setState({open: false})}>
        <fieldset>
          <legend>Anbefalte kommuner</legend>
          <div className="row">
            <div className="col--half">
              <ToggleButtonList
                options={RECOMMENDED_SIMILAR_REGIONS}
                value={selectedSimilarRegions}
                renderButton={region => region.name}
                onChange={this.handleSimilarRegionsChange.bind(this)}/>
            </div>
            <div className="col--half">
              <p className="text--small">
                Disse 6 kommunene er nærmest Sandefjord på befolkningsstørrelse,
                innvandrerandel og flyktningsandel er mest anbefalt å
                sammenlikne med. <a href="#">Les mer om dette utvalget</a>.
              </p>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Anbefalte gjennomsnitt</legend>
          <ToggleButtonList
            options={RECOMMENDED_AVERAGE_REGIONS}
            value={selectedAverageRegions}
            renderButton={region => region.name}
            onChange={this.handleAverageRegionsChange.bind(this)}/>
        </fieldset>
        <div className="fieldset">
          <label htmlFor="compare-search" className="legend">Legg til andre steder</label>
          <div className="search search--subtle">
            <RegionSearch
              placeholder="Kommune/fylke/næringsregion/bydel etc."
              onSelect={this.addOtherRegion.bind(this)}/>
        </div>
          <ToggleButtonList
            options={selectedOtherRegions}
            value={selectedOtherRegions}
            renderButton={region => `${region.name} ${_t(region.type)}`}
            onChange={this.handleOtherRegionsChange.bind(this)}/>
        </div>
        <div className="lightbox__footer">
          <button type="button" className="button">Oppdater graf</button>
          <button type="button" className="button button--small button--secondary button__sidekick">
            <i className="icon__apply"/> Oppdater alle grafer
          </button>
          <button type="button" className="button button--small button--secondary button__sidekick">
            <i className="icon__close"/> Fjern sammenlikninger
          </button>
        </div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </Lightbox>
    )
  }
}
