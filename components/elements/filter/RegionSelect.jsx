import React, {Component, PropTypes} from 'react'
import Lightbox from '../../elements/Lightbox'
import ToggleButtonList from '../../elements/ToggleButtonList'
import RegionSearch from '../../containers/RegionSearch'
import {_t} from '../../../lib/translate'

function renderRegion(region) {
  return `${region.name} ${_t(region.type)}`
}


export default class ToggleButtons extends Component {
  static propTypes = {
    options: PropTypes.shape({
      similar: PropTypes.array,
      average: PropTypes.array
    }).isRequired,
    value: PropTypes.shape({
      similar: PropTypes.array,
      average: PropTypes.array,
      other: PropTypes.array
    }),
    onApply: PropTypes.func,
    onApplyAll: PropTypes.func
  }
  static defaultProps = {
    value: {
      similar: [],
      average: [],
      other: []
    },
    onApply() {},
    onApplyAll() {}
  }

  constructor() {
    super()
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      pendingValue: {
        other: [],
        similar: [],
        average: []
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.reset()
    }
  }

  reset() {
    this.setState(this.getInitialState())
  }

  apply() {
    this.props.onApply(this.state.pendingValue)
    this.reset()
  }

  applyAll() {
    this.props.onApplyAll(this.state.pendingValue)
    this.reset()
  }

  mergePendingValue(key, newValue) {
    return Object.assign({}, this.state.pendingValue, {[key]: newValue})
  }

  handleSimilarRegionsChange(newValue) {
    this.setState({pendingValue: this.mergePendingValue('similar', newValue)})
  }

  handleAverageRegionsChange(newValue) {
    this.setState({pendingValue: this.mergePendingValue('average', newValue)})
  }

  handleOtherRegionsChange(newValue) {
    this.setState({pendingValue: this.mergePendingValue('other', newValue)})
  }

  addOtherRegion(region) {
    this.setState({pendingValue: this.mergePendingValue('other', this.state.pendingValue.other.concat(region))})
  }

  getValue() {
    return this.state.pendingValue ? this.state.pendingValue : this.props.value
  }

  render() {
    const {options, } = this.props

    const value = this.getValue()

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
                options={options.similar}
                value={value.similar}
                renderButton={renderRegion}
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
            options={options.average}
            value={value.average}
            renderButton={renderRegion}
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
            options={value.other}
            value={value.other}
            renderButton={renderRegion}
            onChange={this.handleOtherRegionsChange.bind(this)}/>
        </div>
        <div className="lightbox__footer">
          <button type="button" className="button" onClick={this.apply.bind(this)}>Oppdater graf</button>
          <button type="button" className="button button--small button--secondary button__sidekick" onClick={this.applyAll.bind(this)}>
            <i className="icon__apply"/> Oppdater alle grafer
          </button>
          <button type="button" className="button button--small button--secondary button__sidekick" onClick={this.reset.bind(this)}>
            <i className="icon__close"/> Fjern sammenlikninger
          </button>
        </div>
      </Lightbox>
    )
  }
}
