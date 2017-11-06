import React, {Component, PropTypes} from 'react'
import preventDefault from 'prevent-default'
import screenSize from '../../lib/screenSizes'
import debounce from 'debounce'

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
      isExplicit: false,
      toggleNumbersVisible: true
    }

    this.showToggleNumbers = this.showToggleNumbers.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      debounce(this.showToggleNumbers(), 150)
    })
    this.showToggleNumbers()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps || this.state !== prevState) {
      this.showToggleNumbers()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      debounce(this.showToggleNumbers(), 150)
    })
  }

  showToggleNumbers() {
    const {embedded = false, activeTab} = this.props
    const actualWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

    if (!embedded && actualWidth > screenSize.largePhone && activeTab.urlName === 'enkeltaar') {
      if (this.state.isExplicit || !this.state.toggleNumbersVisible) {  // don't rerender if there's no difference
        this.setState({
          isExplicit: false,
          toggleNumbersVisible: true
        })
      }
    }

    else {
      if (!this.state.isExplicit || this.state.toggleNumbersVisible) {  // don't rerender if there's no difference
        this.setState({
          isExplicit: true,
          toggleNumbersVisible: false
        })
      }
    }
  }

  render() {
    const {onChange, mode: selectedMode} = this.props
    const graphClasses = this.state.toggleNumbersVisible ? 'graph__types' : 'graph__types right'

    return (
      <div className={graphClasses}>

        {this.state.toggleNumbersVisible &&
          <form>
            <label className="control checkbox">
              <input type="checkbox" id="check1" checked={this.props.explicitView} onChange={e => { this.props.setExplicitView(e) }} />
              <i className="control-indicator"></i>
              Vis tall
            </label>
          </form>
        }

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
