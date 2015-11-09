import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import PopupChoicesBox from './PopupChoicesBox'
import {downloadChoicesByRegion} from '../../lib/regionUtil'
import {findHeaderGroupForQuery} from '../../lib/queryUtil'
import {generateCSV, downloadCSV} from '../../lib/csvWrangler'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import apiClient from '../../config/apiClient'


class DownloadWidget extends Component {
  static propTypes = {
    data: ImdiPropTypes.chartData.isRequired,
    region: ImdiPropTypes.region.isRequired,
    allRegions: PropTypes.arrayOf(ImdiPropTypes.region),
    query: ImdiPropTypes.query.isRequired,
    headerGroups: PropTypes.object,
    dispatch: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {}
  }


  handleOpenDownloadSelect(event) {
    event.preventDefault()
    this.setState({isDownloadSelectOpen: !this.state.isDownloadSelectOpen})
  }

  buildCsvQuery(comparisonRegions) {
    const {region, query, headerGroups} = this.props
    const headerGroup = findHeaderGroupForQuery(query, headerGroups)
    return {
      tableName: query.tableName,
      region: region.prefixedCode,
      dimensions: Object.keys(headerGroup).map(headerKey => {
        if (['aar', 'enhet', 'fylkeNr', 'kommuneNr', 'naringsregionNr', 'bydelNr'].includes(headerKey)) {
          return null
        }
        return {name: headerKey}
      }).filter(Boolean),
      year: query.year,
      unit: query.unit,
      comparisonRegions: comparisonRegions.map(reg => reg.prefixedCode)
    }
  }

  renderDownloadSelect() {
    const choices = downloadChoicesByRegion(this.props.region, this.props.allRegions)

    const handApplyChoice = newValue => {
      const csvQuery = this.buildCsvQuery(choices[newValue].regions)

      apiClient.query(csvQuery).then(queryResult => {
        let data = queryResultPresenter(this.props.query, queryResult, {
          chartKind: 'table'
        })

        // Make sure the data looks smart in a table
        const dimensions = data.dimensions.slice()
        if (!dimensions.includes('region')) {
          dimensions.unshift('region')
        }
        if (!dimensions.includes('enhet')) {
          dimensions.push('enhet')
        }
        data = Object.assign({}, data, {dimensions: dimensions})

        // Bake CSV and trigger client download
        const csvData = generateCSV(data).csv
        downloadCSV(csvData, 'tabell.csv')
        this.setState({isDownloadSelectOpen: false})
      })
    }

    const handleCancelDownloadSelect = () => this.setState({isDownloadSelectOpen: false})
    return (
      <PopupChoicesBox
        onCancel={handleCancelDownloadSelect}
        onApply={handApplyChoice}
        choices={choices}
        applyButtonText="Last ned"
        title="Last ned tallgrunnlag"
        choiceLabel="Velg innhold"
        description="Tallgrunnlaget kan lastes ned som en CSV fil som kan åpnes i blant annet Microsoft Excel."
      />
    )
  }


  render() {
    const {isDownloadSelectOpen} = this.state

    return (
      <span className="graph__functions-item">
        <button type="button" className="button button--secondary button--small" onClick={this.handleOpenDownloadSelect.bind(this)}>
          <i className="icon__download"></i> Last ned
        </button>
        {isDownloadSelectOpen && this.renderDownloadSelect()}
      </span>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    allRegions: state.allRegions
  }
}

export default connect(mapStateToProps)(DownloadWidget)
