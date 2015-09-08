import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {openCard, closeCard} from '../../actions/cards'

class Card extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    card: PropTypes.object,
    isOpen: PropTypes.bool
  }

  dispatch(action) {
    this.props.dispatch(action)
  }

  open() {
    this.dispatch(openCard(this.props.card.name))
  }

  close() {
    this.dispatch(closeCard(this.props.card.name))
  }

  render() {
    const {card, isOpen} = this.props
    return (
      <div style={{border: '1px dotted #c0c0c0', marginBottom: 10}}>
        <h3>Card: {card.title} {isOpen && 'Open!'}</h3>
        {isOpen ? <button onClick={this.close.bind(this)}>Close</button> : <button onClick={this.open.bind(this)}>Open</button>}
        <div>
          <pre>{card.query}</pre>
        </div>
        <div>
          <pre>{card.data}</pre>
        </div>
      </div>
    )
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state, ownProps) {
  return {
    isOpen: state.openCards.includes(ownProps.card.name),
    cardData: state.cardData
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(Card)
