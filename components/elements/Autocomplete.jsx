import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import scrollIntoView from 'dom-scroll-into-view'

const DISABLE_AUTO_COMPLETE_INPUT_TEXT = true

/**
 * Based on https://github.com/rackt/react-autocomplete
 * but sadly included here to get more control of styling and custom behavior
 */
export default class Autocomplete extends Component {

  static propTypes = {
    initialValue: PropTypes.any,
    onChange: PropTypes.func,
    items: PropTypes.array,
    onSelect: PropTypes.func,
    shouldItemRender: PropTypes.func,
    renderMenu: PropTypes.func,
    openOnFocus: PropTypes.bool,
    renderItem: PropTypes.func.isRequired,
    sortItems: PropTypes.func,
    menuStyle: PropTypes.object,
    inputProps: PropTypes.object,
    getItemValue: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    inputProps: {},
    openOnFocus: true,
    onChange() {
    },
    onSelect(value, item) {
    },
    renderMenu(items, value, style) {
      return <div style={{...style, ...this.menuStyle}}>{items}</div>
    },
    shouldItemRender() {
      return true
    },
    menuStyle: {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'fixed',
      overflow: 'auto',
      maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
    }
  }

  constructor(props) {
    super()
    this.state = {
      value: props.initialValue || '',
      isOpen: false,
      highlightedIndex: null
    }
  }

  componentWillMount() {
    this._ignoreBlur = false
    this._performAutoCompleteOnUpdate = false
    this._performAutoCompleteOnKeyUp = false
  }

  componentWillReceiveProps() {
    this._performAutoCompleteOnUpdate = true
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpen === true && prevState.isOpen === false) {
      this.setMenuPositions()
    }

    if (this.state.isOpen && this._performAutoCompleteOnUpdate) {
      this._performAutoCompleteOnUpdate = false
      this.maybeAutoCompleteText()
    }

    this.maybeScrollItemIntoView()
  }

  keyDownHandlers = {
    ArrowDown() {
      event.preventDefault()
      const {highlightedIndex} = this.state
      const index = (
        highlightedIndex === null || highlightedIndex === this.getFilteredItems().length - 1
      ) ? 0 : highlightedIndex + 1
      this._performAutoCompleteOnKeyUp = true
      this.setState({
        highlightedIndex: index,
        isOpen: true
      })
    },

    ArrowUp(event) {
      event.preventDefault()
      const {highlightedIndex} = this.state
      const index = (
        highlightedIndex === 0 || highlightedIndex === null
      ) ? this.getFilteredItems().length - 1 : highlightedIndex - 1
      this._performAutoCompleteOnKeyUp = true
      this.setState({
        highlightedIndex: index,
        isOpen: true
      })
    },

    Enter(event) {
      if (this.state.isOpen === false) {
        // already selected this, do nothing
        return
      }
      if (this.state.highlightedIndex === null) {
        // hit enter after focus but before typing anything so no autocomplete attempt yet
        this.setState({
          isOpen: false
        }, () => {
          findDOMNode(this.refs.input).select()
        })
      } else {
        const item = this.getFilteredItems()[this.state.highlightedIndex]
        const value = this.props.getItemValue(item)
        this.setState({
          value: '',
          isOpen: false,
          highlightedIndex: null
        }, () => {
          //findDOMNode(this.refs.input).focus() // TODO: file issue
          findDOMNode(this.refs.input).setSelectionRange(
            this.state.value.length,
            this.state.value.length
          )
          this.selectItem(value, item)
        })
      }
    },

    Escape(event) {
      this.setState({
        highlightedIndex: null,
        isOpen: false
      })
    }
  }

  maybeScrollItemIntoView() {
    if (this.state.isOpen === true && this.state.highlightedIndex !== null) {
      const itemNode = findDOMNode(this.refs[`item-${this.state.highlightedIndex}`])
      const menuNode = findDOMNode(this.refs.menu)
      scrollIntoView(itemNode, menuNode, {onlyScrollIfNeeded: true})
    }
  }

  handleKeyDown(event) {
    if (this.keyDownHandlers[event.key]) {
      this.keyDownHandlers[event.key].call(this, event)
    } else {
      this.setState({
        highlightedIndex: null,
        isOpen: true
      })
    }
  }

  handleChange(event) {
    this._performAutoCompleteOnKeyUp = true
    this.setState({
      value: event.target.value,
    }, () => {
      this.props.onChange(event, this.state.value)
    })
  }

  handleKeyUp() {
    if (this._performAutoCompleteOnKeyUp) {
      this._performAutoCompleteOnKeyUp = false
      this.maybeAutoCompleteText()
    }
  }

  getFilteredItems() {
    let items = this.props.items

    if (this.props.shouldItemRender) {
      items = items.filter(item => (
        this.props.shouldItemRender(item, this.state.value)
      ))
    }

    if (this.props.sortItems) {
      items = items.slice().sort((item, otherItem) => (
        this.props.sortItems(item, otherItem, this.state.value)
      ))
    }

    return items
  }

  maybeAutoCompleteText() {

    if (DISABLE_AUTO_COMPLETE_INPUT_TEXT || this.state.value === '') {
      return
    }

    const {highlightedIndex} = this.state
    const items = this.getFilteredItems()
    if (items.length === 0) {
      return
    }
    const matchedItem = highlightedIndex !== null ? items[highlightedIndex] : items[0]
    const itemValue = this.props.getItemValue(matchedItem)
    const itemValueDoesMatch = itemValue.toLowerCase().indexOf(this.state.value.toLowerCase()) === 0
    if (itemValueDoesMatch) {
      const node = findDOMNode(this.refs.input)
      const setSelection = () => {
        node.value = itemValue
        node.setSelectionRange(this.state.value.length, itemValue.length)
      }
      if (highlightedIndex === null) {
        this.setState({highlightedIndex: 0}, setSelection)
      } else {
        setSelection()
      }
    }
  }

  setMenuPositions() {
    const node = findDOMNode(this.refs.input)
    const rect = node.getBoundingClientRect()
    const computedStyle = getComputedStyle(node)
    const marginBottom = parseInt(computedStyle.marginBottom, 10)
    const marginLeft = parseInt(computedStyle.marginLeft, 10)
    const marginRight = parseInt(computedStyle.marginRight, 10)
    this.setState({
      menuTop: rect.bottom + marginBottom,
      menuLeft: rect.left + marginLeft,
      menuWidth: rect.width + marginLeft + marginRight
    })
  }

  highlightItemFromMouse(index) {
    this.setState({highlightedIndex: index})
  }

  selectItem(value, item) {
    this.props.onSelect(value, item)
  }

  selectItemFromMouse(item) {
    const value = this.props.getItemValue(item)
    this.setState({
      value: '',
      isOpen: false,
      highlightedIndex: null
    }, () => {
      this.selectItem(value, item)
      findDOMNode(this.refs.input).focus()
      this.setIgnoreBlur(false)
    })
  }

  setIgnoreBlur(ignore) {
    this._ignoreBlur = ignore
  }

  renderMenu() {
    const items = this.getFilteredItems().map((item, index) => {
      const element = this.props.renderItem(
        item,
        this.state.highlightedIndex === index,
        {cursor: 'default'}
      )
      return React.cloneElement(element, {
        onMouseDown: () => this.setIgnoreBlur(true),
        onMouseEnter: () => this.highlightItemFromMouse(index),
        onClick: () => this.selectItemFromMouse(item),
        ref: `item-${index}`,
      })
    })
    const style = {
      left: this.state.menuLeft,
      top: this.state.menuTop,
      minWidth: this.state.menuWidth,
    }
    const menu = this.props.renderMenu(items, this.state.value, style)
    return React.cloneElement(menu, {ref: 'menu'})
  }

  handleInputBlur() {
    if (this._ignoreBlur) {
      return
    }
    this.setState({
      isOpen: false,
      highlightedIndex: null
    })
  }

  handleInputFocus() {
    if (this._ignoreBlur) {
      return
    }
    if (this.props.openOnFocus) {
      this.setState({isOpen: true})
    }
  }

  handleInputClick() {
    if (this.state.isOpen === false && this.props.openOnFocus) {
      this.setState({isOpen: true})
    }
  }

  render() {
    const {style, className, inputProps} = this.props
    const {isOpen, value} = this.state
    return (
      <div style={style} className={className}>
        <input
          {...inputProps}
          role="combobox"
          aria-autocomplete="both"
          ref="input"
          onFocus={this.handleInputFocus.bind(this)}
          onBlur={this.handleInputBlur.bind(this)}
          onChange={event => this.handleChange(event)}
          onKeyDown={event => this.handleKeyDown(event)}
          onKeyUp={event => this.handleKeyUp(event)}
          onClick={this.handleInputClick.bind(this)}
          value={value}
        />
        {isOpen && this.renderMenu()}
      </div>
    )
  }
}
