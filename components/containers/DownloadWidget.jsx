import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import PopupChoicesBox from './PopupChoicesBox'
import {downloadChoicesByRegion} from '../../lib/regionUtil'
import {findHeaderGroupForQuery} from '../../lib/queryUtil'
import {generateCSV} from '../../lib/csvWrangler'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import apiClient from '../../config/apiClient'
import {trackDownloadCompareAll, trackDownloadCompareSimilar} from '../../actions/tracking'
import toVismaQuery from '../../lib/api-client/utils/toVismaQuery'
import toVismaCompareQuery from '../../lib/api-client/utils/toVismaCompareQuery'
import {toQueryParams} from '../../lib/api-client/visma'

import {saveAs} from 'browser-filesaver'

function downloadCSV(content, fileName) {
  const blob = new Blob([content], {type: 'text/csv;charset=utf-8'})
  saveAs(blob, fileName)
}


class DownloadWidget extends Component {
  static propTypes = {
    region: ImdiPropTypes.region.isRequired,
    allRegions: PropTypes.arrayOf(ImdiPropTypes.region),
    query: ImdiPropTypes.query.isRequired,
    headerGroups: PropTypes.array,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super()
    this.state = {}
  }


  handleOpenDownloadSelect(event) {
    event.preventDefault()
    this.setState({isDownloadSelectOpen: !this.state.isDownloadSelectOpen})
  }

  buildCsvQuery(choice) {
    const comparisonRegions = choice.regions.slice().map(reg => reg.prefixedCode)
    const {region, query, headerGroups} = this.props
    const headerGroup = findHeaderGroupForQuery(query, headerGroups)
    const unwantedDimensions = ['aar', 'enhet', 'fylkeNr', 'kommuneNr', 'naringsregionNr', 'bydelNr']

    const csvQuery = {
      tableName: query.tableName,
      region: region.prefixedCode,
      dimensions: Object.keys(headerGroup).map(headerKey => {
        if (unwantedDimensions.includes(headerKey)) {
          return null
        }
        return {name: headerKey}
      }).filter(Boolean),
      year: 'all',
      unit: headerGroup.enhet,
      comparisonRegions: comparisonRegions
    }

    // Instead of comparing a county with a bunch of municipalities, we want to just look at those municipalities
    if (choice.overrideRegion) {
      const arbitraryRegion = comparisonRegions[0]
      csvQuery.region = arbitraryRegion
      csvQuery.comparisonRegions = csvQuery.comparisonRegions.filter(prefixedCode => prefixedCode !== arbitraryRegion)
    }

    return csvQuery
  }

  renderDownloadSelect() {
    const choices = downloadChoicesByRegion(this.props.region, this.props.allRegions)

    const handApplyChoice = newValue => {
      this.props.dispatch(newValue == 0 ? trackDownloadCompareSimilar() : trackDownloadCompareAll())

      // Show loading overlay while downloading
      this.setState({isLoading: true})

      // --- IMDIKATOR intercept --- //

      const csvQuery = this.buildCsvQuery(choices[newValue])
      const isComparing = ((csvQuery.comparisonRegions || []).length > 0)
      const modifiedQuery = isComparing ? toVismaCompareQuery(csvQuery) : toVismaQuery(csvQuery)
      const upCasedQuery = Object.assign({}, toQueryParams(modifiedQuery))

      // Call node server for CSV file
      apiClient.getCsvFile(upCasedQuery).then(queryResult => {

        console.log(queryResult)

      //   let data = queryResultPresenter(this.props.query, queryResult, {
      //     chartKind: 'table'
      //   })

      //   // Make sure the data looks smart in a table
      //   const dimensions = data.dimensions.slice()
      //   if (!dimensions.map(e => e.name).includes('region')) {
      //     dimensions.unshift({
      //       name: 'region',
      //       variables: []
      //     })
      //   }
      //   if (!dimensions.map(e => e.name).includes('enhet')) {
      //     dimensions.push({
      //       name: 'enhet',
      //       variables: []
      //     })
      //   }

      //   if (!dimensions.map(e => e.name).includes('aar')) {
      //     dimensions.push({
      //       name: 'aar',
      //       variables: []
      //     })
      //   }


      //   data = Object.assign({}, data, {dimensions: dimensions})

      //   // Bake CSV and trigger client download (and hide loading overlay)
      //   const csvData = generateCSV(data).csv
      //   downloadCSV(csvData, 'tabell.csv')


        this.setState({
          isDownloadSelectOpen: false,
          isLoading: false
        })
      })
    }

    const handleCancelDownloadSelect = () => this.setState({isDownloadSelectOpen: false})

    return (
      <PopupChoicesBox
        onCancel={handleCancelDownloadSelect}
        onApply={handApplyChoice}
        isLoading={this.state.isLoading}
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
