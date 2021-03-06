import React, { Component, PropTypes } from 'react';
import canvg from 'canvg-browser';

import * as ImdiPropTypes from '../proptypes/ImdiPropTypes';
import saveSvgAsPng from '../../lib/saveSvgAsPng';

require('../../lib/closestPolyfill');

function detectIE() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

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
    downloadPNG: PropTypes.func,
    chartKind: PropTypes.string,
    chartId: PropTypes.string
  };

  constructor(props) {
    super();

    this.state = {
      choiceNumber: 0,
      moveRight: 25,
      moveDown: 5
    };

    this.onCancel = this.onCancel.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onChange = this.onChange.bind(this);
    this.downloadSVG = this.downloadSVG.bind(this);

    this.chartDownloadVersion = this.chartDownloadVersion.bind(this);
  }

  onCancel() {
    this.props.onCancel();
  }

  onApply(choiceValue) {
    this.props.onApply(choiceValue);
  }

  onChange(event) {
    const choiceNumber = event.target.value;
    this.setState({ choiceNumber: choiceNumber });
  }

  downloadSVG() {
    const { downloadScreenshot, setExplicitView } = this.props;
    const svg = this.lightbox
      .closest('.toggle-list__section.toggle-list__section--expanded')
      .querySelector('.chart__svg');
    setExplicitView(true);
    downloadScreenshot(svg);
    setExplicitView(false);
  }

  addValuesToTransform(element, addX, addY) {
    const transform = element.getAttribute('transform');
    let transformValues;

    if (!transform.includes(',')) {
      // IE11 excludes all existing commas from the transform property of obvious reasons (no reason).

      // So we'll split on space instead
      transformValues = transform.split(' ');
    } else {
      transformValues = transform.split(',');
    }

    // before ["translate(0", "-2.34)"]
    // after ["0", "-2.34"]
    const values = [
      transformValues[0].split('(')[1],
      transformValues[1].split(')')[0]
    ];

    // before ["0", "-2.34"]
    // after (if x is 10 and y is 20) [10, 7.66]
    if (addX) values[0] = parseInt(values[0], 10) + addX;
    if (addY) values[1] = parseInt(values[1], 10) + addY;

    element.setAttribute(
      'transform',
      `translate(${values[0].toString()}, ${values[1].toString()})`
    );
  }

  downloadPNG() {
    const svg = document.querySelector(`#${this.props.chartId} .chart__svg`);

    svg.style.background = 'white';

    let options = {};
    const ieVersion = detectIE();
    if (ieVersion !== false && ieVersion < 12) {
      options = { canvg: canvg, backgroundColor: '#FFFFFF' };
    }
    this.chartDownloadVersion(true); // style chart for download
    saveSvgAsPng.saveSvgAsPng(svg, 'imdi-diagram.jpg', options); // download the png
    this.chartDownloadVersion(false); // revert chart to normal
  }

  // this function ensures proper styling, like font sizes, horisontal lines and text positions.
  // because fonts and positions defaults to browser (ugly) standards.
  chartDownloadVersion(chartIsForDownload) {
    const { moveRight, moveDown } = this.state;

    const svg = document.querySelector('[data-chart]');
    const d3 = document.querySelector('.chart__d3-points');
    const text = document.querySelector('text.svg-text.title');
    const numbersAboveGraph = document.querySelectorAll('.chart__text');
    const bubbleText = document.querySelectorAll('.chart__node');
    const horizontalLines = document.querySelectorAll(
      '.chart__line--benchmark'
    );
    const allText = document.querySelectorAll(
      'text.svg-text:not(.title), .chart__text--benchmark, tspan, .chart__text'
    );

    if (chartIsForDownload) {
      svg.style.setProperty('transform', 'translate(2px, 1px)');
      text.style.setProperty('transform', 'translate(1px, 18px)');

      // make sure font family is consistent with the rest of the site
      Array.from(allText).forEach(textElement => {
        textElement.style.setProperty(
          'font-family',
          '"Siri", Tahoma, sans-serif'
        );
      });

      Array.from(bubbleText).forEach(bubbleEl => {
        bubbleEl.style.setProperty('font-family', '"Siri", Tahoma, sans-serif');
      });

      // nugde numbers above graph upwards
      Array.from(numbersAboveGraph).forEach(textElement => {
        // chart pyramid has different positions
        if (textElement.getAttribute('class').includes('chart__pyramid')) {
          textElement.style.setProperty('transform', 'translate(5px, -4px)');
        } else {
          textElement.style.setProperty('transform', 'translate(-7px, -4px)');
        }
        textElement.style.setProperty('font-size', '12px');
      });

      Array.from(horizontalLines).forEach(line => {
        line.style.setProperty('stroke', 'rgb(242, 239, 237)');
      });

      // chart overflows left side- so nudge it 10px right
      d3.setAttribute('height', '105%');
      this.addValuesToTransform(d3, moveRight, moveDown);

      text.style.setProperty('display', 'initial');
      text.style.setProperty('display', 'initial');
      text.style.setProperty('font-size', '25px');
      text.style.setProperty('transform', 'translateY(30px)');
    } else {
      this.addValuesToTransform(d3, -moveRight, -moveDown);
      text.style.setProperty('display', 'none');
      svg.style.setProperty('transform', 'translate(0px, 0px)');
      text.style.setProperty('transform', 'translateY(0px)');
    }
  }

  render() {
    const { chartKind } = this.props;

    let downloadImage =
      chartKind === 'bar' || chartKind === 'bubble' || chartKind === 'pyramid';

    return (
      <div
        ref={lightbox => {
          this.lightbox = lightbox;
        }}
        className="lightbox lightbox--as-popup lightbox--inline lightbox--animate"
      >
        <div className="lightbox__backdrop" />
        <dialog open="open" className="lightbox__box lightbox__narrow">
          <i className="lightbox__point" style={{ left: '9.5em' }} />
          <div role="document">
            <button
              type="button"
              className="lightbox__close-button"
              onClick={this.onCancel.bind(this)}
            >
              <i className="icon__close icon--red lightbox__close-button-icon" />
              <span className="t-only-screenreaders">Lukk</span>
            </button>
            <h6 className="lightbox__title">{this.props.title}</h6>

            <p>{this.props.description}</p>

            <div>
              {this.props.choices.map(choice => (
                <div>
                  <a
                    type="button"
                    disabled={this.props.isLoading}
                    onClick={() => this.onApply(choice.value)}
                    key={choice.value}
                    style={{ cursor: 'pointer' }}
                  >
                    {choice.description} (.csv)
                  </a>
                </div>
              ))}

              {/* <select
                  id="popupchoicesbox-select"
                  value={this.state.choiceNumber}
                  onChange={this.onChange.bind(this)}
                >
                  {this.props.choices.map(choice => (
                    <option value={choice.value} key={choice.value}>
                      {choice.description}
                    </option>
                  ))}
                </select> */}
            </div>
            <div className="t-margin-bottom--large" />
            <div className="">
              {/* generate csv button */}
              <h6 className="">Bildeformat</h6>
              {downloadImage && (
                // download svg button
                // <button type="button" disabled={this.props.isLoading} className="button download__svg download__button" onClick={() => { this.downloadSVG() }}>
                //   {this.props.isLoading ? <span><i className="loading-indicator loading-indicator--white" /> Laster…</span> : 'Last ned SVG (vektor)'}
                // </button>

                // download png button
                <a
                  ref={pngButton => {
                    this.pngButton = pngButton;
                  }}
                  disabled={this.props.isLoading}
                  onClick={event => {
                    this.downloadPNG(event);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Bilde av grafen (.png)
                </a>
              )}
            </div>

            {/* error downloading svg message */}
            {this.props.isError &&
              !this.props.isLoading && (
                <div>
                  <p>
                    <strong>En feil oppsto</strong>
                  </p>
                  <p>Kunne ikke genere CSV-fil</p>
                </div>
              )}
          </div>
        </dialog>
      </div>
    );
  }
}
