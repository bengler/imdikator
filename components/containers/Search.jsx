import React, {Component} from 'react'

import Autocomplete from 'react-autocomplete'

import kommuner from '../../data/kommuner'
import fylker from '../../data/fylker'
import naeringsregioner from '../../data/naeringsregioner'
import bydeler from '../../data/bydeler'

function getRegions() {
  return kommuner.concat(fylker, naeringsregioner, bydeler)
}

function matchRegionToTerm(region, value) {
  return region.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
}

function sortRegions(a, b, value) {
  return (
    a.name.toLowerCase().indexOf(value.toLowerCase())
    > b.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
  )
}

export default class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {regions: getRegions()}
  }

  // TODO: This has to be completely rewritten
  navigateToRegion(region) {
    const id = region.type[0] + region.code
    window.R.navigate('/steder/' + id + '/befolkning/befolkning_hovedgruppe/latest')
  }

  renderItems(items) {
    return items.map((item, index) => {
      const text = item.props.children
      let res = item
      if (index === 0 || items[index - 1].props.children.charAt(0) !== text.charAt(0)) {
        const style = {
          background: '#eee',
          color: '#454545',
          padding: '2px 6px',
          fontWeight: 'bold'
        }
        res = [<div style={style}>{text.charAt(0)}</div>, item]
      }
      return res
    })
  }

  render() {
    const styles = {
      highlightedItem: {},
      item: {}
    }

    return (
      <Autocomplete
        items={this.state.regions}
        getItemValue={item => item.name}
        shouldItemRender={matchRegionToTerm}
        onSelect={(value, item) => this.navigateToRegion(item)}
        sortItems={sortRegions}
        renderItem={(item, isHighlighted) => (
          <div
            style={isHighlighted ? styles.highlightedItem : styles.item}
            key={item.name + ',' + item.type}
            id={item.code}
            >{item.name}</div>
          )}
          renderMenu={(items, value, style) => (
            <div style={{...styles.menu, ...style}}>
              {this.state.loading ? (
                <div style={{padding: 6}}>Loading...</div>
                ) : items.length === 0 ? (
                <div style={{padding: 6}}>Ingen treff for '{value}'</div>
                ) : this.renderItems(items)}
              </div>
              )}
            />
    )
  }

}
