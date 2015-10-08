import React, {Component, PropTypes} from 'react'
import Lightbox from '../elements/Lightbox'
import ToggleButtonList from '../elements/ToggleButtonList'
import RegionSearch from '../containers/RegionSearch'
import {_t} from '../../lib/translate'
import {connect} from 'react-redux'
import difference from 'lodash.difference'
import union from 'lodash.union'
import {loadAllRegions} from '../../actions/region'
import {prefixify} from '../../lib/regionUtil'

class RegionSelect extends Component {
  static propTypes = {
    similar: PropTypes.array,
    average: PropTypes.array,
    value: PropTypes.array,
    onApply: PropTypes.func,
    onApplyAll: PropTypes.func,
    onCancel: PropTypes.func,
    dispatch: PropTypes.func,
    allRegions: PropTypes.array
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

  componentWillMount() {
    this.props.dispatch(loadAllRegions())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({value: nextProps.value})
    }
  }

  renderRegion(regionCode) {
    const region = this.props.allRegions.find(reg => {
      return prefixify(reg) === regionCode
    })
    return `${region.name} ${_t(region.type)}`
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

    const {allRegions, similar, average, onCancel} = this.props

    if (allRegions.length === 0) {
      return null
    }

    const {value} = this.state

    const other = difference(value, union(similar, average))

    const hasChanges = this.state.value !== this.props.value

    return (
      <Lightbox title="Legg til sammenlikning" onClose={onCancel}>
        {similar && (
          <fieldset>
            <legend>Anbefalte kommuner</legend>
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
                  [TODO] Disse 6 kommunene er nærmest Sandefjord på befolkningsstørrelse,
                  innvandrerandel og flyktningsandel er mest anbefalt å
                  sammenlikne med. <a href="#">Les mer om dette utvalget</a>.
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
          <div className="search search--subtle">
            <RegionSearch
              placeholder="Kommune/fylke/næringsregion/bydel etc."
              onSelect={region => this.handleAdd(prefixify(region))}/>
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
function mapStateToProps(state) {
  return {
    allRegions: state.allRegions
  }
}

export default connect(mapStateToProps)(RegionSelect)
