import React, {Component, PropTypes} from 'react'
import RegionSelect from '../elements/filter/RegionSelect'

export default class TestRegionSelect extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      open: true,
      similarRegions: []
    }
  }

  render() {
    const {similarRegions, open} = this.state
    return (
      <RegionSelect
        open={open}
        similarRegions={similarRegions}
      />
    )
  }
}
