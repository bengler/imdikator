import React, {Component, PropTypes} from 'react'
import Clipboard from 'clipboard'
import Lightbox from '../elements/Lightbox'

function defer(wait, fn) {
  return setTimeout(fn, wait)
}

export default class PopupShareBox extends Component {

  static propTypes = {
    onCancel: PropTypes.func,
    chartUrl: PropTypes.string.isRequired
  };

  constructor(props) {
    super()
    this.state = {copied: false}
  }

  componentDidMount() {
    this._clipboardInstance = new Clipboard(this.refs.clipboardButton)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.copied) {
      clearTimeout(this._resetCopiedState)
      this._resetCopiedState = defer(2000, () => {
        this.setState({copied: false}) // eslint-disable-line react/no-did-update-set-state
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this._resetCopiedState)
    this._clipboardInstance.destroy()
  }


  render() {
    const {onCancel, chartUrl} = this.props
    const {copied} = this.state

    return (
      <Lightbox
        className="lightbox--as-popup lightbox--inline lightbox--animate"
        onClose={onCancel}
        title="Lenke til figuren"
      >
        <div role="document">
          <p>
            Lenken vil vise til valgt figur med den samme filtreringen som nå er valgt.
          </p>
          <label style={{display: 'inline-block'}}>
            <span className="label">Lenke til figuren</span>
            <input
              type="text"
              id="popupsharebox-input"
              className="input form--small form--inline" readOnly value={chartUrl}
              onFocus={e => e.target.select()}
            />
          </label>
          <button
            ref="clipboardButton"
            type="button"
            className="button button--secondary"
            data-clipboard-text={chartUrl}
            onClick={() => this.setState({copied: true})}
          >
            {copied ? '✓ Kopiert' : 'Kopier'}
          </button>
        </div>
      </Lightbox>
    )
  }
}
