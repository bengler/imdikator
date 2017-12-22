import React, {Component, PropTypes} from 'react'
import preventDefault from 'prevent-default'

const defaultPrevented = preventDefault(() => false)

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
    mode: PropTypes.string,
    setExplicitView: PropTypes.func,
    explicitView: PropTypes.bool,
    embedded: PropTypes.bool,
    activeTab: PropTypes.object,
    chartUrl: PropTypes.string
  };

  constructor() {
    super()

    this.state = {
      isExplicit: true
    }
  }

  render() {
    const {onChange, mode: selectedMode, embedded} = this.props

    const graphTypeClasses = embedded ? 'graph__types' : 'graph__types right'

    return (
      <div className={graphTypeClasses}>
        <ul className="tabs-mini" role="tablist">

          {
            CHART_MODES.map(mode => {
              if (mode.name === selectedMode) {
                return (<a
                  href=""
                  key={mode.name}
                  onClick={defaultPrevented}
                  className="tabs-mini__link tabs-mini__link--current">{mode.title}
                </a>)
              }
              return (
                <a href=""
                  key={mode.name}
                  className="tabs-mini__link"
                  onClick={preventDefault(() => onChange(mode.name))}
                >
                  {mode.title}
                </a>
              )
            })
              .map(content => {
                return (<li
                  key={content.key}
                  className="tabs-mini__item"
                  role="tab"
                  aria-selected={content.key == selectedMode}>{content}
                </li>)
              }
            )
            }
        </ul>
        {this.props.embedded &&
          <a
            onClick={() => { sessionStorage.setItem('imdi-open-search-box-default', true) }}
            href={this.props.chartUrl}
            className="button button--primary button--small t-no-margin">

            Finn tall for din kommune
          </a>
        }
      </div>
    )
  }
}
