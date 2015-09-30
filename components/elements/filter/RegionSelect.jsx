import React, {Component, PropTypes} from 'react'
import Lightbox from '../../elements/Lightbox'
import ToggleButtonList from '../../elements/ToggleButtonList'
import RegionSearch from '../../containers/RegionSearch'
import {_t} from '../../../lib/translate'

function renderRegion(region) {
  return `${region.name} ${_t(region.type)}`
}


export default class RegionSelect extends Component {
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
    onApplyAll: PropTypes.func,
    onCancel: PropTypes.func
  }
  static defaultProps = {
    value: {
      similar: [],
      average: [],
      other: []
    },
    options: {
      similar: [],
      average: [],
      other: []
    },
    onApply() {},
    onApplyAll() {},
    onCancel() {}
  }

  constructor(props) {
    super()
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({value: nextProps.value})
    }
  }

  rollback() {
    this.setState({value: this.props.value})
  }

  clear() {
    this.setState({value: null})
  }

  apply() {
    this.props.onApply(this.state.value)
  }

  applyAll() {
    this.props.onApplyAll(this.state.value)
  }

  mergeValue(key, newValue) {
    return Object.assign({}, this.state.value, {[key]: newValue})
  }

  handleSimilarRegionsChange(newValue) {
    this.setState({value: this.mergeValue('similar', newValue)})
  }

  handleAverageRegionsChange(newValue) {
    this.setState({value: this.mergeValue('average', newValue)})
  }

  handleOtherRegionsChange(newValue) {
    this.setState({value: this.mergeValue('other', newValue)})
  }

  addOtherRegion(region) {
    const {value} = this.state
    const current = value && value.other || []
    this.setState({value: this.mergeValue('other', current.concat(region))})
  }

  render() {
    const {options, onCancel} = this.props

    const {value} = this.state

    const hasChanges = this.state.value !== this.props.value

    return (
      <Lightbox title="Legg til sammenlikning" onClose={onCancel}>
        <fieldset>
          <legend>Anbefalte kommuner</legend>
          <div className="row">
            <div className="col--half">
              <ToggleButtonList
                options={options.similar}
                value={(value && value.similar) ? value.similar : []}
                renderButton={renderRegion}
                onChange={this.handleSimilarRegionsChange.bind(this)}/>
            </div>
            <div className="col--half">
              <p className="text--small">
                [TODO] Disse 6 kommunene er nærmest Sandefjord på befolkningsstørrelse,
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
            value={(value && value.average) ? value.average : []}
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
            options={(value && value.other) ? value.other : []}
            value={(value && value.other) ? value.other : []}
            renderButton={renderRegion}
            onChange={this.handleOtherRegionsChange.bind(this)}/>
        </div>
        <div className="lightbox__footer">
          <button type="button" className="button" onClick={this.apply.bind(this)}>Oppdater graf</button>
          <button type="button" className="button button--small button--secondary button__sidekick" onClick={this.applyAll.bind(this)}>
            <i className="icon__apply"/> Oppdater alle grafer
          </button>
          <button type="button" className="button button--small button--secondary button__sidekick" disabled={!hasChanges} onClick={this.rollback.bind(this)}>
            <i/> Tilbakestill
          </button>
          <button type="button" className="button button--small button--secondary button__sidekick" onClick={this.clear.bind(this)}>
            <i className="icon__close"/> Fjern sammenlikninger
          </button>
        </div>
      </Lightbox>
    )
  }
}
