import React from 'react'
import {_t} from '../../lib/translate'

class Autocomplete extends React.Component {

  static propTypes = {
    initialValue: React.PropTypes.any,
    onChange: React.PropTypes.func,
    items: React.PropTypes.array,
    onSelect: React.PropTypes.func,
    shouldItemRender: React.PropTypes.func,
    renderMenu: React.PropTypes.func,
    openOnFocus: React.PropTypes.bool,
    renderItem: React.PropTypes.func.isRequired,
    sortItems: React.PropTypes.func,
    focusAfterSelect: React.PropTypes.bool,
    menuStyle: React.PropTypes.object,
    inputProps: React.PropTypes.object,
    getItemValue: React.PropTypes.func,
    style: React.PropTypes.object,
    className: React.PropTypes.string
  };

  constructor() {
    super()

    this.state = {
      input: '',
      allPlaces: [],
      autocompleteSuggestions: [],
      chosenPlace: 0
    }

    this.giveFocus = this.giveFocus.bind(this)
    this.removeFocus = this.removeFocus.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.findItemsInArrayOfPlaces = this.findItemsInArrayOfPlaces.bind(this)
  }

  componentDidMount() {
    // get all names from places
    this.state.places = this.props.items.map(item => {
      const itemDescription = (_t(item.type) && item.prefixedCode != 'F00') ? `${item.name}, ${_t(item.type)}` : item.name
      return itemDescription
    })
  }

  findItemsInArrayOfPlaces(place) {
    if (!place) return ''

    // matches the user input with the list of places and returns the matched place
    return this.state.places.filter(placeItem => {
      return placeItem.toLowerCase().includes(place.toLowerCase())
    })
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value || '',
      autocompleteSuggestions: this.findItemsInArrayOfPlaces(event.target.value)
    })
  }

  handleClick(place) {
    const itemFound = this.findItemsInArrayOfPlaces(place)
    // if (itemFound.length) // submit or search
  }

  removeFocus() {
    this.searchResult.blur()
  }

  giveFocus() {
    this.searchResult.focus()
  }

  render() {
    const {initialValue, onChange, items, onSelect, shouldItemRender, renderMenu, openOnFocus, renderItem, sortItems, focusAfterSelect, menuStyle, inputProps, getItemValue, style, className} = this.props
    const {autocompleteSuggestions} = this.state

    return (
      <div>
        <input
          type="text"
          value={this.state.input}
          onChange={event => { this.handleInputChange(event) }}
          onBlur={() => this.removeFocus()}
          onFocus={() => this.giveFocus()}
          placeholder={this.props.inputProps.placeholder}
          role="combobox"
          aria-autocomplete="both"
          aria-haspopup="true"
          aria-activedescendant="item-2"
        />

        <ul
          className="search-result"
          role="listbox"
          ref={searchResult => this.searchResult = searchResult}>

          {autocompleteSuggestions
            && autocompleteSuggestions.map((item, index) => (

              <li
                id={`search-result--item item-${index}`}
                onClick={() => this.handleClick(item)}
                onBlur={() => this.removeFocus()}
                onFocus={() => this.giveFocus()}
                role="option"
                key={item.concat(index)}>

                <a className={index === 0
                  ? 'search-result__result search-result__result--selected'
                  : 'search-result__result'}>
                  {item}
                  <i className="icon__arrow-right icon--red search-result__icon"></i>
                </a>}
              </li>
           ))
          }

        </ul>
      </div>
    )
  }
}

export default Autocomplete
