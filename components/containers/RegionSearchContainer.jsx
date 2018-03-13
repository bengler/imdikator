import React, {PropTypes, Component} from 'react'
import RegionSearch from '../elements/RegionSearch'
import {connect} from 'react-redux'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class RegionSearchContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    allRegions: PropTypes.arrayOf(ImdiPropTypes.region),
    onSelect: PropTypes.func,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    onSelect() {}
  }

  render() {
    const {allRegions, placeholder, onSelect} = this.props

    // remove norge's næringsregion and kommune
    const filteredAllRegions = allRegions.filter(region => {
      return region.prefixedCode !== 'K0000' && region.prefixedCode !== 'N00'
    })

    return <RegionSearch regions={filteredAllRegions} placeholder={placeholder} onSelect={onSelect} />
  }
}

function mapStateToProps(state) {
  return {
    allRegions: state.allRegions
  }
}

export default connect(mapStateToProps)(RegionSearchContainer)
