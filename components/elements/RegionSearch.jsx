import React, {PropTypes, Component} from 'react'
import Autocomplete from '../elements/Autocomplete'
import {_t} from '../../lib/translate'
import cx from 'classnames'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

function shouldItemRender(region, value) {
  return region.name.toLowerCase().includes(value.toLowerCase())
}

function sortRegions(region, otherRegion, value) {
  return (
    region.name.toLowerCase().indexOf(value.toLowerCase())
    > otherRegion.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
  )
}

export default class RegionSearch extends Component {

  static propTypes = {
    regions: PropTypes.arrayOf(ImdiPropTypes.region),
    onSelect: PropTypes.func,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    onSelect() {}
  }

  constructor() {
    super()
    this.state = {didForceOpen: false}
  }

  handleSelectRegion(region) {
    this.props.onSelect(region)
  }

  renderItem(item, isHighlighted) {
    const classes = cx({
      'search-result__result': true,
      'search-result__result--selected': isHighlighted
    })
    const itemDescription = _t(item.type) ? item.name + ', ' + _t(item.type) : item.name
    return (
      <div
        key={item.name + item.type}
        className={classes}
      >
        {itemDescription}
      </div>
    )
  }

  renderMenu(items, value, style) {
    const styles = {
      highlightedItem: {},
      item: {}
    }

    if (items.length === 0) {
      return wrap(<div style={{padding: 6}}>Ingen treff for '{value}'</div>)
    }

    const displayItems = 15 + Math.pow(value.length, 4)

    return wrap(items.slice(0, displayItems))

    function wrap(children) {
      return <div style={{...styles.menu, ...style}}>{children}</div>
    }
  }

  render() {
    const {regions, placeholder} = this.props

    return (
      <Autocomplete
        items={regions}
        getItemValue={item => item.name}
        openOnFocus={false}
        shouldItemRender={shouldItemRender}
        onForceOpen={() => this.setState({forceOpen: true})}
        onClose={() => this.setState({forceOpen: false})}
        onSelect={(value, item) => this.handleSelectRegion(item)}
        sortItems={sortRegions}
        inputProps={{placeholder: placeholder}}
        renderItem={this.renderItem.bind(this)}
        renderMenu={this.renderMenu.bind(this)}
      />
    )
  }
}