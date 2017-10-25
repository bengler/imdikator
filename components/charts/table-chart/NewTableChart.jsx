import React from 'react'
import {generateCSV} from '../../../lib/csvWrangler'

class TableChart extends React.Component {

  static propTypes = {
    data: React.PropTypes.object
  }

  constructor() {
    super()

    this.state = {
      thead: null,
      tbody: null
    }

    this.formatDataForTable = this.formatDataForTable.bind(this)
    this.ensureDataHasYearDimension = this.ensureDataHasYearDimension.bind(this)
  }

  componentDidMount() {
    this.formatDataForTable(this.props.data)
  }

  formatDataForTable(data) {
    // eslint-disable-next-line
    const getHeadersFromKeys = data.rows.map(item => item.kjonn)

    console.log(generateCSV(this.ensureDataHasYearDimension(data)))

    
    this.state.thead = getHeadersFromKeys
    // this.state.tbody = data.rows.map()
  }

  ensureDataHasYearDimension(data) {
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

  render() {
    const {thead, tbody} = this.state

    return (
      <div className="table__wrapper">

        <table className="table table--collapsable table--fluid">
          <caption>Tabell: Andel av integreringstilskuddet i flytteåret</caption>
          <thead>
            <tr>
              {thead && thead.length && thead.map(td => <td key={td}>{td}</td>)}
            </tr>
          </thead>
          <tbody data-table-collapsable>
            <tr>
              <td data-label="Flytting i tiden">01.01.–31.03.</td>
              <td data-label="Andel til fraflyttingskommune">1/8</td>
              <td data-label="Andel til tilflyttingskommune">7/8</td>
            </tr>
            <tr>
              <td data-label="Flytting i tiden">01.04.–30.06.</td>
              <td data-label="Andel til fraflyttingskommune">3/8</td>
              <td data-label="Andel til tilflyttingskommune">5/8</td>
            </tr>
            <tr>
              <td data-label="Flytting i tiden">01.07.–30.09.</td>
              <td data-label="Andel til fraflyttingskommune">5/8</td>
              <td data-label="Andel til tilflyttingskommune">3/8</td>
            </tr>
            <tr>
              <td data-label="Flytting i tiden">01.10.–31.12.</td>
              <td data-label="Andel til fraflyttingskommune">7/8</td>
              <td data-label="Andel til tilflyttingskommune">1/8</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default TableChart
