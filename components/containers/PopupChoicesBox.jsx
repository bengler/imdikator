import React, {Component, PropTypes} from 'react'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import saveSvgAsPng from '../../lib/saveSvgAsPng'

export default class PopupChoicesBox extends Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    choices: ImdiPropTypes.dowloadChoices,
    title: PropTypes.string,
    description: PropTypes.string,
    choiceLabel: PropTypes.string,
    applyButtonText: PropTypes.string,
    linkUrl: PropTypes.string,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    downloadScreenshot: PropTypes.func,
    setExplicitView: PropTypes.func,
    downloadPNG: PropTypes.func
  };

  constructor(props) {
    super()

    this.state = {
      choiceNumber: 0
    }

    this.onCancel = this.onCancel.bind(this)
    this.onApply = this.onApply.bind(this)
    this.onChange = this.onChange.bind(this)
    this.downloadSVG = this.downloadSVG.bind(this)
  }

  onCancel() {
    this.props.onCancel()
  }

  onApply() {
    this.props.onApply(this.state.choiceNumber)
  }

  onChange(event) {
    const choiceNumber = event.target.value
    this.setState({choiceNumber: choiceNumber})
  }

  downloadSVG() {
    const {downloadScreenshot, setExplicitView} = this.props
    const svg = this.lightbox.closest('.toggle-list__section.toggle-list__section--expanded').querySelector('.chart__svg')
    setExplicitView(true)
    downloadScreenshot(svg)
    setExplicitView(false)
  }

  addValuesToTransform(element, addX, addY) {

    const transform = element.getAttribute('transform')
    let transformValues

    if (!transform.includes(',')) {
      // IE11 excludes all existing commas from the transform property of obvious reasons (no reason).
      // So we'll split on space instead
      transformValues = transform.split(' ')
    }
    else {
      transformValues = transform.split(',')
    }

    // before ["translate(0", "-2.34)"]
    // after ["0", "-2.34"]
    const values = [transformValues[0].split('(')[1], transformValues[1].split(')')[0]]

    // before ["0", "-2.34"]
    // after (if x is 10 and y is 20) [10, 7.66]
    if (addX) values[0] = parseInt(values[0], 10) + addX
    if (addY) values[1] = parseInt(values[1], 10) + addY

    element.setAttribute('transform', `translate(${values[0].toString()}, ${values[1].toString()})`)
  }

  downloadPNG() {
    const svg = document.querySelector('.chart__svg')
    const text = document.querySelector('text.svg-text')
    const d3 = document.querySelector('.chart__d3-points')

    const moveRight = 25

    svg.style = {
      backgroundColor: 'white'
    }

    text.style.fontFamily = 'Avenir'

    // chart overflows left side- so nudge it 10px right
    this.addValuesToTransform(d3, moveRight, 0)

    // download the png
    saveSvgAsPng.saveSvgAsPng(svg, 'imdi-diagram.jpg')

    // nudge chart back to normal
    this.addValuesToTransform(d3, -moveRight, 0)
  }

  render() {
    return (
      <div ref={lightbox => { this.lightbox = lightbox }} className="lightbox lightbox--as-popup lightbox--inline lightbox--animate">
        <div className="lightbox__backdrop"></div>
        <dialog open="open" className="lightbox__box">
          <i className="lightbox__point" style={{left: '9.5em'}}></i>
          <div role="document">
            <button type="button" className="lightbox__close-button" onClick={this.onCancel.bind(this)}>
              <i className="icon__close icon--red lightbox__close-button-icon" />
              <span className="t-only-screenreaders">Lukk</span>
            </button>
            <h6 className="lightbox__title">{this.props.title}</h6>

            <p>{this.props.description}</p>

            <label style={{display: 'inline-block'}}>
              <span className="label">{this.props.choiceLabel}</span>
              <div className="select t-margin-bottom">
                <select id="popupchoicesbox-select" value={this.state.choiceNumber} onChange={this.onChange.bind(this)}>
                  {this.props.choices.map(choice => (
                    <option value={choice.value} key={choice.value}>{choice.description}</option>
                  ))}
                </select>
              </div>
            </label>

            <div className="download-buttons">

              {/* generate csv button */}
              <button type="button" disabled={this.props.isLoading} className="button download__button" onClick={this.onApply.bind(this)}>
                {this.props.isLoading ? <span><i className="loading-indicator loading-indicator--white" /> Laster…</span> : this.props.applyButtonText}
              </button>

              {/* download svg button */}
              <button type="button" disabled={this.props.isLoading} className="button download__svg download__button" onClick={() => { this.downloadSVG() }}>
                {this.props.isLoading ? <span><i className="loading-indicator loading-indicator--white" /> Laster…</span> : 'Last ned SVG (vektor)'}
              </button>

              {/* download png button */}
              <a type="button" ref={pngButton => { this.pngButton = pngButton }} disabled={this.props.isLoading} className="button download__button" onClick={event => { this.downloadPNG(event) }}>
                {this.props.isLoading ? <span><i className="loading-indicator loading-indicator--white" /> Laster…</span> : 'Last ned PNG (bilde)'}
              </a>

              {/* download svg button */}
              {this.props.linkUrl && !this.props.isLoading
                && <div>
                  <p><strong>CSV er klar for nedlastning:</strong></p>
                  <a href={this.props.linkUrl} title="last ned CSV">Last ned CSV</a>
                </div>
              }
            </div>

            {/* error downloading svg message */}
            {this.props.isError && !this.props.isLoading
              && <div>
                <p><strong>En feil oppsto</strong></p>
                <p>Kunne ikke genere CSV-fil</p>
              </div>
            }

          </div>
        </dialog>
      </div>
    )
  }
}
