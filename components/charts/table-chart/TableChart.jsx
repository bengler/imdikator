import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'
import {generateCSV} from '../../../lib/csvWrangler'

// TableChart always needs year as a dimension. Add it if missing.
function ensureDataHasYearDimension(data) {
  const dimensions = data.dimensions
  const gotYear = dimensions.find(dimension => {
    return dimension.name == 'aar'
  })
  if (gotYear) {
    return data
  }
  dimensions.push({name: 'aar', variables: []})
  return Object.assign({}, data, {dimensions: dimensions})
}

export default class TableChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  };

  constructor() {
    super()

    this.toggleRowVisibility = this.toggleRowVisibility.bind(this)
    this.setupToggleRowVisibility = this.setupToggleRowVisibility.bind(this)
  }

  componentWillMount() {
    const data = ensureDataHasYearDimension(this.props.data)
    this.setState(generateCSV(data), () => {
      this.setupToggleRowVisibility()
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevState || prevProps !== this.state) {
      this.setupToggleRowVisibility()
    }
  }

  componentWillReceiveProps(props) {
    const data = ensureDataHasYearDimension(props.data)
    this.setState(generateCSV(data))
  }

  toggleRowVisibility() {

    const trigger = event.target
    const parent = trigger.parentNode
    const isHidden = parent.getAttribute('aria-hidden') === 'true'

    if (isHidden) {
      trigger.classList.remove('expanded')
      parent.setAttribute('aria-hidden', false)
    } else {
      trigger.classList.add('expanded')
      parent.setAttribute('aria-hidden', true)
    }
  }

  setupToggleRowVisibility() {
    document.querySelectorAll('[data-table-chart]').forEach(table => {
      const tableRows = table.querySelectorAll('tr')
      tableRows.forEach(row => {

        const columns = row.children
        const trigger = columns[0]
        trigger.addEventListener('click', () => {
          this.toggleRowVisibility()
        })
      })
    })
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
    table.classed('table--chart', true)
    table.classed('table--fluid', true)

    const parser = d3.dsv(data.separator, 'text/plain')
    const parsedData = parser.parseRows(data.csv)
    const transposedData = d3.transpose(parsedData)

    table.append('thead')
    .append('tr')
    .selectAll('th')
    .data(transposedData[1]) // headers
    .enter()
    .append('th')
    .attr('scope', 'col')
    .text(dataItem => {
      return dataItem
    })

    const tableBody = table.append('tbody').attr('data-table-chart', '')

    const rows = tableBody.selectAll('tr')
    .data(transposedData.slice(2))
    .enter()
    .append('tr')

    rows.selectAll('td')
    .data(dataItem => dataItem)
    .enter()
    .append('td')
    .attr('data-label', (dataItem, index) => transposedData[1][index])
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
