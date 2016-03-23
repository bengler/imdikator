import React, {Component, PropTypes} from 'react'
import preventDefault from 'prevent-default'

const CHART_MODES = [
  {
    name: 'chart',
    title: 'Figur'
  },
  {
    name: 'table',
    title: 'Tabell'
  }
]

export default class ChartModeSelect extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    mode: PropTypes.string
  };

  render() {
    const {onChange, mode: selectedMode} = this.props
    return (
      <div className="graph__types">
        <ul className="tabs-mini" role="tablist">
          {
            CHART_MODES.map(mode => {
              if (mode.name === selectedMode) {
                return <span key={mode.name} className="tabs-mini__link tabs-mini__link--current">{mode.title}</span>
              }
              return (
                <a href=""
                  key={mode.name}
                  className="tabs-mini__link tabs-mini__link--current"
                  onClick={preventDefault(() => onChange(mode.name))}
                >
                  {mode.title}
                </a>
              )
            })
              .map(content => {
                return <li key={content.key} className="tabs-mini__item" role="tab">{content}</li>
                /* TODO: Should have correct aria-selected={tabState} on each li.
                  Now a screenreader can not infer the state. Does not work on the child element. */
              }
            )
            }
        </ul>
      </div>
    )
  }
}
