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

  componentWillMount() {
    const data = ensureDataHasYearDimension(this.props.data)
    this.setState(generateCSV(data), () => {
      this.setupToggleRowVisibility()
    })
  }

  componentWillReceiveProps(props) {
    const data = ensureDataHasYearDimension(props.data)
    this.setState(generateCSV(data))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevState || prevProps !== this.state) {
      this.setupToggleRowVisibility()
    }
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
    document.querySelectorAll('[data-table-collapsable]').forEach(table => {
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
    table.classed('table--collapsable', true)
    table.classed('table--fluid', true)

    const parser = d3.dsv(data.separator, 'text/plain')
    const parsedData = parser.parseRows(data.csv)
    const transposedData = d3.transpose(parsedData)

    // console.log(data.csv)
    const headers = transposedData.map(dataItem => {
      if (dataItem[0].includes(':')) {
        return dataItem[0].split(':')[0]
      }

      return dataItem
    })

    const getHeadersFromTbody = values => {
      return values.map(value => value.map(insideValue => {
        if (insideValue.includes(':')) {
          return insideValue.split(':')[0]
        }
        
        return insideValue
      }))
    }

    const excludeHeaderFromTbody = values => {
      return values.map(value => {
        if (value.includes(':')) {
          return value.split(':')[1]
        }
        return value
      })
    }

    const thead = getHeadersFromTbody(transposedData.slice(2))[0]

    table.append('thead')
    .append('tr')
    .selectAll('th')
    .data(thead)
    .enter()
    .append('th')
    .attr('scope', 'col')
    .text(dataItem => dataItem)

    const tableBody = table.append('tbody').attr('data-table-collapsable', '')

    const rows = tableBody.selectAll('tr')
    .data(transposedData.slice(2))
    .enter()
    .append('tr')

    rows.selectAll('td')
    .data(dataItem => excludeHeaderFromTbody(dataItem))
    .enter()
    .append('td')
    .attr('data-label', (dataItem, index) => thead[index]) // set thead as data-label propery
    .text(dataItem => dataItem)

    // table.selectAll('tr').each(function (d, i) {
    //   if (this.firstChild.tagName == 'TH') {
    //     const firstchild = d3.select(this.firstChild)
    //     firstchild.text('')
    //   } else {
    //     const row = d3.select(this)
    //     const firstchild = d3.select(this.firstChild)
    //     row.insert('th', ':first-child')
    //     .text(firstchild.text())
    //     .attr('scope', 'row')
    //     .classed('table__th table__th--row', true)
    //     firstchild.remove()
    //   }
    // })
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
