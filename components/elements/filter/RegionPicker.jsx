import React, {Component, PropTypes} from 'react'
import ToggleButtonList from '../ToggleButtonList'
import RegionSearch from '../RegionSearch'
import {difference, union} from 'lodash'

import * as ImdiPropTypes from '../../proptypes/ImdiPropTypes'

export default class RegionPicker extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(ImdiPropTypes.regionPickerGroup),
    value: PropTypes.arrayOf(ImdiPropTypes.region),
    choices: PropTypes.arrayOf(ImdiPropTypes.region),
    renderChoice: PropTypes.func,
    onApply: PropTypes.func,
    onApplyAll: PropTypes.func,
    onCancel: PropTypes.func
  };
  static defaultProps = {
    value: [],
    groups: [],
    choices: [],
    renderChoice(choice, i, choices) {
      // choice should be an array of one or more regions here (usually only one)
      return choice.map(region => region.name).join(', ')
    },
    onApply() {},
    onCancel() {}
  };

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

  clear() {
    this.setState({value: []})
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

  renderButton(value) {
    const {renderChoice} = this.props
    return renderChoice([value])
  }

  handleRemove(region) {
    this.setState({value: this.state.value.filter(val => val != region)})
  }

  renderGroup(group) {
    const {value} = this.state

    const buttons = (
      <ToggleButtonList
        options={group.items}
        value={value}
        renderButton={this.renderButton.bind(this)}
        onAdd={this.handleAdd.bind(this)}
        onRemove={this.handleRemove.bind(this)}
      />
    )
    const description = group.description && (<p className="t-margin-top text--small">{group.description}</p>)
    return (
      <fieldset key={group.name}>
        <legend>{group.title}</legend>
        {buttons}
        {description}
      </fieldset>
    )

  }

  render() {

    const {groups, choices, onApplyAll} = this.props

    const {value} = this.state

    const grouped = union(...groups.map(group => group.items))

    const other = difference(value, grouped)

    return (
      <div>

        <div className="row">
          <div className="col--half">
            {groups.map(group => this.renderGroup(group))}
          </div>
          <div className="col--half">
            <div className="fieldset">
              <label><span className="label legend">Legg til sted</span>
                <div className="search search--autocomplete">
                  <RegionSearch
                    placeholder="Kommune/fylke/næringsregion/bydel etc."
                    regions={choices}
                    onSelect={region => this.handleAdd(region)}
                  />
                </div>
              </label>
              <ToggleButtonList
                options={other}
                value={value}
                renderButton={this.renderButton.bind(this)}
                onAdd={this.handleAdd.bind(this)}
                onRemove={this.handleRemove.bind(this)}
              />
              <p className="t-margin-top text--small">Du kan sammenlikne på tvers av
                kommuner, fylker, næringsregioner og bydeler. Velg prosent som enhet for å
                enklere kunne sammenlikne steder med store forskjeller i befolkningstall.
              </p>
            </div>
          </div>
        </div>
        <div className="lightbox__footer">
          <button type="button" className="button" onClick={this.apply.bind(this)}>Oppdater figur</button>

          {onApplyAll && (
            <button
              type="button"
              className="button button--small button--secondary button__sidekick"
              onClick={this.applyAll.bind(this)}
            >
              <i className="icon__apply" /> Oppdater alle figurer
            </button>
          )}

          <button
            type="button"
            className="button button--small button--secondary button__sidekick"
            onClick={this.clear.bind(this)}
          >
            <i className="icon__close" /> Fjern sammenlikninger
          </button>
        </div>
      </div>
    )
  }
}
