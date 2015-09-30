import React, {PropTypes, Component} from 'react'
import Autocomplete from '../elements/Autocomplete'
import {connect} from 'react-redux'
import {loadAllRegions} from '../../actions/region'
import {_t} from '../../lib/translate'
import cx from 'classnames'

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

class RegionSearch extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    regions: PropTypes.array,
    onSelect: PropTypes.func,
    placeholder: PropTypes.text,
    loading: PropTypes.bool
  }
  static defaultProps = {
    onSelect() {}
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(loadAllRegions())
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
        className={classes}
        key={item.name + item.type}
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

    const {loading} = this.props
    if (loading) {
      return wrap(<div style={{padding: 6}}>Loading...</div>)
    }

    if (value.length < MIN_LENGTH) {
      return wrap()
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
    const {regions, placeholder} = this.props

    return (
      <Autocomplete
        items={regions}
        getItemValue={item => item.name}
        shouldItemRender={shouldItemRender}
        onSelect={(value, item) => this.handleSelectRegion(item)}
        sortItems={sortRegions}
        inputProps={{placeholder: placeholder}}
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
    loading: state.allRegions.length === 0,
    regions: state.allRegions
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(RegionSearch)
