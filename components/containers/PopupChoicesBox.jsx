import React, {Component, PropTypes} from 'react'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

export default class PopupChoicesBox extends Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    choices: ImdiPropTypes.dowloadChoices,
    title: PropTypes.string,
    description: PropTypes.string,
    choiceLabel: PropTypes.string,
    applyButtonText: PropTypes.string,
    isLoading: PropTypes.bool
  };

  constructor(props) {
    super()
    this.state = {choiceNumber: 0}
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


  render() {
    return (
      <div className="lightbox lightbox--as-popup lightbox--inline lightbox--animate">
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
            <button type="button" disabled={this.props.isLoading} className="button" onClick={this.onApply.bind(this)}>
              {this.props.isLoading ? <span><i className="loading-indicator" /> Laster…</span> : this.props.applyButtonText}
            </button>

          </div>
        </dialog>
      </div>
    )
  }
}
