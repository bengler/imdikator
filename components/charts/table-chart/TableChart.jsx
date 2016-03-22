import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'
import {generateCSV} from '../../../lib/csvWrangler'


export default class TableChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  };

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

    d3.select(el).classed('table__wrapper', true)

    d3.select(el).select('table').remove()
    const table = d3.select(el).append('table')
    table.classed('table', true)
    table.classed('table--fluid', true)

    const parser = d3.dsv(data.separator, 'text/plain')
    const parsedData = parser.parseRows(data.csv)
    const transposedData = d3.transpose(parsedData)


    table.append('thead')
    .append('tr')
    .selectAll('th')
    .data(transposedData[0])
    .enter()
    .append('th')
    .text(dataItem => dataItem)

    const tableBody = table.append('tbody')

    const rows = tableBody.selectAll('tr')
    .data(transposedData.slice(1))
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
