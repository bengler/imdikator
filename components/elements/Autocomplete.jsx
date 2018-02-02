import React from 'react'
import ReactDOM from 'react-dom'
import {_t} from '../../lib/translate'
import {trackRegionChanged} from '../../actions/tracking'

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

    this.giveFocus = this.giveFocus.bind(this)
    this.removeFocus = this.removeFocus.bind(this)
    this.submitSearch = this.submitSearch.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.findItemsInArrayOfPlaces = this.findItemsInArrayOfPlaces.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    // this.handleSelectRegion = this.handleSelectRegion.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.getFilteredItems = this.getFilteredItems.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    // get all names from places
    this.state.places = this.props.items.map(item => {

      const {centralityName, centralityNumber, code, commerceRegionCode, countyCode, imdiRegion, prefixedCode, type} = item

      const itemDescription = {
        name: (_t(item.type) && item.prefixedCode != 'F00') ? `${item.name}, ${_t(item.type)}` : item.name,
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

  getFilteredItems() {
    let items = this.props.items
    const value = this.state.autocompleteSuggestions[this.state.chosenPlace].value

    if (this.props.shouldItemRender) {
      items = items.filter(item => {
        return this.props.shouldItemRender(item, value)
      })
    }

    if (this.props.sortItems) {
      items = items.slice().sort((item, otherItem) => (
        this.props.sortItems(item, otherItem, value)
      ))
    }

    return items
  }

  selectItem(value, item) {
    console.log(value, item)
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
      autocompleteSuggestions: this.findItemsInArrayOfPlaces(event.target.value)
    })
  }

  // finally route user somewhere else
  submitSearch(place) {
    console.log(107, place)
    // const itemFound = this.findItemsInArrayOfPlaces(place.name)

    const item = this.getFilteredItems()[0]
    console.log(111, item)
    const value = this.props.getItemValue(item)
    console.log(113, value)

    this.selectItem(value, item)

    //   const region = itemFound[0].prefixedCode
    //   console.log(114, {region, item, value})
    // this.handleSelectRegion(region)
    // }
  }

  removeFocus() {

    this.setState({
      input: '',
      autocompleteSuggestions: [],
      chosenPlace: 0
    })
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
      this.submitSearch(autocompleteSuggestions[chosenPlace], chosenPlace)
      this.removeFocus()
    }

    //======= ARROW DOWN
    else if (key === 40) {
      if (chosenPlace + 1 >= autocompleteSuggestions.length) return // don't select something past the lists length

      this.setState({chosenPlace: this.state.chosenPlace + 1})
    }

    //======= ARROW UP
    else if (key === 38) {
      if (chosenPlace - 1 < 0) return // don't select something before the list begins

      this.setState({chosenPlace: this.state.chosenPlace - 1})
    }

    //======= ESCAPE
    else if (key === 27) {
      this.removeFocus()
    }
  }

  handleClick(evt, index) {
    const {autocompleteSuggestions, chosenPlace} = this.state

    this.setState({chosenPlace: index}, () => {
      this.submitSearch(autocompleteSuggestions[chosenPlace])
      this.removeFocus()
    })
  }

  render() {
    const {autocompleteSuggestions} = this.state

    return (
      <div>
        <input
          type="text"
          value={this.state.input}
          onChange={event => { this.handleInputChange(event) }}
          onKeyDown={event => { this.handleKeyPress(event) }}
          onBlur={() => { this.removeFocus() }}
          placeholder={this.props.inputProps.placeholder}
          role="combobox"
          aria-autocomplete="both"
          aria-haspopup="true"
          aria-activedescendant="item-2"
        />

        <ul
          className="search-result"
          role="listbox"
          ref={searchResult => { this.searchResult = searchResult }}>

          {autocompleteSuggestions
            && autocompleteSuggestions.map((item, index) => (

              <li
                id={`search-result--item item-${index}`}
                onMouseDown={evt => this.handleClick(evt, index)}
                onBlur={() => this.removeFocus()}
                onFocus={() => this.giveFocus()}
                role="option"
                key={item.name.concat(index)}>

                <a className={index === this.state.chosenPlace
                  ? 'search-result__result search-result__result--selected'
                  : 'search-result__result'}>
                  {item.name}
                  <i className="icon__arrow-right icon--red search-result__icon"></i>
                </a>
              </li>
           ))
          }
        </ul>
      </div>
    )
  }
}

export default Autocomplete
