import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'
import {generateCSV} from '../../../lib/csvWrangler'


export default class TableChart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: React.PropTypes.object
  }
  /* eslint-enable react/forbid-prop-types */


  componentWillMount() {
    this.setState(generateCSV(this.props.data))
  }


  componentWillReceiveProps(props) {
    this.setState(generateCSV(props.data))
  }


  drawPoints(el, data) {
    if (!data) {
      return
    }

    // We don't draw in the SVG in this Component
    d3.select(el).select('svg').remove()

    d3.select(el).style('overflow', 'scroll')

    d3.select(el).select('table').remove()
    const table = d3.select(el).append('table')
    //const tableHeader = table.append('thead')
    const tableBody = table.append('tbody')

    const parser = d3.dsv(data.separator, 'text/plain')
    const parsedData = parser.parseRows(data.csv)

    const rows = tableBody.selectAll('tr')
    .data(parsedData)
    .enter()
    .append('tr')

    rows.selectAll('td')
    .data(dataItem => dataItem)
    .enter()
    .append('td')
    .text(dataItem => dataItem)
  }


  render() {
    const functions = {
      drawPoints: this.drawPoints
    }
    return (
      <div>
        <D3Chart data={this.state} functions={functions} />
      </div>
    )
  }
}
