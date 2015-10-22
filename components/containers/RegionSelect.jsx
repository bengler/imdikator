import React, {Component, PropTypes} from 'react'
import Lightbox from '../elements/Lightbox'
import ToggleButtonList from '../elements/ToggleButtonList'
import RegionSearch from '../containers/RegionSearch'
import difference from 'lodash.difference'
import union from 'lodash.union'

const RegionType = PropTypes.shape({
  code: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string
})

export default class RegionSelect extends Component {
  static propTypes = {
    similar: PropTypes.arrayOf(RegionType),
    average: PropTypes.arrayOf(RegionType),
    value: PropTypes.arrayOf(RegionType),
    choices: PropTypes.arrayOf(RegionType),
    onApply: PropTypes.func,
    onApplyAll: PropTypes.func,
    onCancel: PropTypes.func,
  }
  static defaultProps = {
    value: [],
    onApply() {},
    onApplyAll() {},
    onCancel() {}
  }

  constructor(props) {
    super()
    this.state = {
      value: props.value || []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({value: nextProps.value})
    }
  }
  renderRegion(region) {
    return `${region.name}`
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

  handleAdd(region) {
    const {value} = this.state
    if (value.includes(region)) {
      return
    }
    this.setState({value: value.concat(region)})
  }

  handleRemove(region) {
    this.setState({value: this.state.value.filter(val => val != region)})
  }

  render() {

    const {similar, average, onCancel} = this.props

    const {value} = this.state

    const other = difference(value, union(similar, average))

    const hasChanges = this.state.value !== this.props.value

    return (
      <Lightbox title="Legg til sammenlikning" onClose={onCancel}>
        {similar && (
          <fieldset>
            <legend>Anbefalte steder</legend>
            <div className="row">
              <div className="col--half">
                <ToggleButtonList
                  options={similar}
                  value={value}
                  renderButton={this.renderRegion.bind(this)}
                  onAdd={this.handleAdd.bind(this)}
                  onRemove={this.handleRemove.bind(this)}/>
              </div>
              <div className="col--half">
                <p className="text--small">
                  Disse stedene er nærmest det valgte stedet på befolkningsstørrelse,
                  innvandrerandel og flyktningsandel og er mest anbefalt å
                  sammenlikne med. <a href="#">Les mer om dette utvalget</a>. [TODO]
                </p>
              </div>
            </div>
          </fieldset>
        )}
        {average && (
          <fieldset>
            <legend>Anbefalte gjennomsnitt</legend>
            <ToggleButtonList
              options={average}
              value={value}
              renderButton={this.renderRegion.bind(this)}
              onAdd={this.handleAdd.bind(this)}
              onRemove={this.handleRemove.bind(this)}
              />
          </fieldset>
        )}
        <div className="fieldset">
          <label htmlFor="compare-search" className="legend">Legg til andre steder</label>
          <div className="search search--autocomplete">
            <RegionSearch
              placeholder="Kommune/fylke/næringsregion/bydel etc."
              onSelect={region => this.handleAdd(region.prefixedCode)}/>
          </div>
          <ToggleButtonList
            options={other}
            value={value}
            renderButton={this.renderRegion.bind(this)}
            onAdd={this.handleAdd.bind(this)}
            onRemove={this.handleRemove.bind(this)}
          />
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
