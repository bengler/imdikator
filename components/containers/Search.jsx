import React, {PropTypes, Component} from 'react'
import Autocomplete from 'react-autocomplete'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {prefixify} from '../../lib/regionUtil'
const MIN_LENGTH = 1

function shouldItemRender(region, value) {

  if (value.length < MIN_LENGTH) {
    return false
  }
  return region.name.toLowerCase().includes(value.toLowerCase())
}

function sortRegions(a, b, value) {
  return (
    a.name.toLowerCase().indexOf(value.toLowerCase())
    > b.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
  )
}

class Search extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    regions: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(loadAllRegions())
  }

  navigateToRegion(region) {
    this.context.goTo('/steder/:region/:pageName/:cardName', {
      region: prefixify(region),
      pageName: 'befolkning',
      cardName: 'befolkning_hovedgruppe'
    })
  }

  renderItem(item, isHighlighted) {
    const styles = {
      highlightedItem: {},
      item: {}
    }

    return (
      <div
        style={isHighlighted ? styles.highlightedItem : styles.item}
        key={item.name + ',' + item.type}
        id={item.code}>
        {item.name}
      </div>
    )
  }

  renderMenu(items, value, style) {
    const styles = {
      highlightedItem: {},
      item: {}
    }

    const {loading} = this.state
    if (loading) {
      return wrap(<div style={{padding: 6}}>Loading...</div>)
    }

    if (value.length < MIN_LENGTH) {
      return wrap(<div style={{padding: 6}}>Skriv inn navn på sted</div>)
    }

    if (items.length === 0) {
      return wrap(<div style={{padding: 6}}>Ingen treff for '{value}'</div>)
    }

    return wrap(this.renderItems(items))

    function wrap(children) {
      return <div style={{...styles.menu, ...style}}>{children}</div>
    }
  }

  renderItems(items) {
    return items.map((item, index) => {
      const text = item.props.children
      if (index === 0 || items[index - 1].props.children.charAt(0) !== text.charAt(0)) {
        const style = {
          background: '#eee',
          color: '#454545',
          padding: '2px 6px',
          fontWeight: 'bold'
        }
        return [<div style={style}>{text.charAt(0)}</div>, item]
      }
      return item
    })
  }

  render() {
    const {regions} = this.props
    return (
      <Autocomplete
        items={regions}
        getItemValue={item => item.name}
        shouldItemRender={shouldItemRender}
        onSelect={(value, item) => this.navigateToRegion(item)}
        sortItems={sortRegions}
        renderItem={this.renderItem.bind(this)}
        renderMenu={this.renderMenu.bind(this)}
      />
    )
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    regions: state.allRegions
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(Search)
