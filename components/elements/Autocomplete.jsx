import React from 'react'
import {_t} from '../../lib/translate'

class Autocomplete extends React.Component {
  static propTypes = {
    items: React.PropTypes.array,
    inputProps: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    getItemValue: React.PropTypes.func,
    shouldItemRender: React.PropTypes.func,
    sortItems: React.PropTypes.func,
    onChange: React.PropTypes.func
  }

  constructor() {
    super()

    this.state = {
      places: [],
      input: '',
      allPlaces: [],
      autocompleteSuggestions: [],
      chosenPlace: 0
    }

    this.findItemsInArrayOfPlaces = this.findItemsInArrayOfPlaces.bind(this)
    this.handleSetPageStyles = this.handleSetPageStyles.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.submitSearch = this.submitSearch.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.removeFocus = this.removeFocus.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.giveFocus = this.giveFocus.bind(this)
    this.sortItems = this.sortItems.bind(this)
  }

  componentDidMount() {
    // get all names from places
    this.state.places = this.props.items.map(item => {
      const {centralityName, centralityNumber, code, commerceRegionCode, countyCode, imdiRegion, prefixedCode, type} = item

      const itemDescription = {
        name: _t(item.type) && item.prefixedCode != 'F00' ? `${item.name}, ${_t(item.type)}` : item.name,
        value: item.name,
        prefixedCode,
        centralityName,
        centralityNumber,
        code,
        commerceRegionCode,
        countyCode,
        imdiRegion,
        type: type
      }

      return itemDescription
    })
  }


  selectItem(value, item) {
    this.props.onSelect(value, item)
  }

  findItemsInArrayOfPlaces(place) {
    if (!place) return ''

    // matches the user input with the list of places and returns the matched place
    return this.state.places.filter(placeItem => {
      return placeItem.name.toLowerCase().includes(place.toLowerCase())
    })
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value || '',
      autocompleteSuggestions: this.sortItems(this.findItemsInArrayOfPlaces(event.target.value))
    })
    this.handleSetPageStyles(true);
  }

  /*
    Add layout styles to the main page container
    -> This needs to happen so that the autocomplete appears over the footer,
    -> which has a high z-index.
  */
  handleSetPageStyles(addFocus = true) {
    const container = document.getElementById('page-content');
    if (container) {
      container.style.position = addFocus ? 'relative' : 'initial';
      container.style.overflow = addFocus ? 'visible' : 'initial';
      container.style.zIndex = addFocus ? '6' : 'initial';
    }
  }

  sortItems(unsortedItems) {
    let items = unsortedItems

    if (this.props.sortItems && items.length) {
      items = items.slice().sort((item, otherItem) => {
        return this.props.sortItems(item, otherItem, this.state.input)
      })
    }

    return items
  }

  removeFocus() {
    this.setState({
      input: '',
      autocompleteSuggestions: [],
      chosenPlace: 0
    })

    this.handleSetPageStyles(false);
  }

  submitSearch(place) {
    this.selectItem(place.value, place)
    this.removeFocus()
  }

  giveFocus() {
    this.searchResult.focus()
  }

  handleKeyPress(event) {
    const key = event.which || event.keyCode

    if (!key) return
    const {autocompleteSuggestions, chosenPlace} = this.state

    //======= ENTER
    if (key === 13) {
      this.submitSearch(autocompleteSuggestions[chosenPlace])

    } else if (key === 40) {
      //======= ARROW DOWN
      if (chosenPlace + 1 >= autocompleteSuggestions.length) return // don't select something past the lists length

      this.setState({chosenPlace: chosenPlace + 1})
    } else if (key === 38) {
      //======= ARROW UP
      if (chosenPlace - 1 < 0) return // don't select something before the list begins

      this.setState({chosenPlace: chosenPlace - 1})
    } else if (key === 27) {
      //======= ESCAPE
      this.removeFocus()
    }
  }

  handleClick(evt, index) {
    const {autocompleteSuggestions} = this.state

    this.setState({chosenPlace: index}, () => {
      this.submitSearch(autocompleteSuggestions[index], index)
    })
  }

  render() {
    const {autocompleteSuggestions, chosenPlace} = this.state

    return (
      <div>
        <input
          type="text"
          value={this.state.input}
          onChange={event => {
            this.handleInputChange(event)
          }}
          onKeyDown={event => {
            this.handleKeyPress(event)
          }}
          onBlur={() => {
            this.removeFocus()
          }}
          placeholder={this.props.inputProps.placeholder}
          role="combobox"
          aria-autocomplete="both"
          aria-haspopup="true"
          aria-activedescendant="item-2"
        />

        {autocompleteSuggestions.length > 0 && (
          <ul
            className="search-result"
            style={{ zIndex: 6 }}
            role="listbox"
            ref={searchResult => {
              this.searchResult = searchResult
            }}
          >
            {autocompleteSuggestions.map((item, index) => (
              <li
                id={`search-result--item item-${index}`}
                onMouseDown={evt => this.handleClick(evt, index)}
                onTouchEnd={evt => this.handleClick(evt, index)}
                onBlur={() => this.removeFocus()}
                onFocus={() => this.giveFocus()}
                role="option"
                key={item.name.concat(index)}
              >
                <a className={index === chosenPlace ? 'search-result__result search-result__result--selected' : 'search-result__result'}>
                  {item.name}
                  <i className="icon__arrow-right icon--red search-result__icon" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default Autocomplete
