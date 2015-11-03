import React, {Component, PropTypes} from 'react'

export default class PopupChoicesBox extends Component {

  // choices should look something like this
  // choices = [
  //   {
  //     value: 0,
  //     description: 'Description of alternative one'
  //   },
  //   ...
  // ]

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    choices: PropTypes.array,
    title: PropTypes.string,
    cancelButtonText: PropTypes.string,
    applyButtonText: PropTypes.string
  }

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
      <div className="lightbox">
        <div className="lightbox__backdrop"></div>
        <section className="lightbox__box" style={{marginTop: '15px', position: 'relative'}}>
          <i className="lightbox__point"/>
          <button type="button" className="lightbox__close-button" onClick={this.onCancel.bind(this)}>
            <i className="icon__close icon--red lightbox__close-button-icon"/>
            <span className="t-only-screenreaders">Lukk</span>
          </button>
          <h6 className="lightbox__title">{this.props.title}</h6>

          <select value={this.state.choiceNumber} onChange={this.onChange.bind(this)}>
            {this.props.choices.map(choice => (
              <option value={choice.value} key={choice.value}>{choice.description}</option>
            ))}
          </select>

          <div className="lightbox__footer">
            <button type="button" className="button" onClick={this.onApply.bind(this)}>{this.props.applyButtonText}</button>
            <button type="button" className="button" onClick={this.onCancel.bind(this)}>{this.props.cancelButtonText}</button>
          </div>
        </section>
      </div>
    )
  }
}
