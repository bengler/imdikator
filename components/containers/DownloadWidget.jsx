import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import PopupChoicesBox from './PopupChoicesBox'
import {downloadChoicesByRegion} from '../../lib/regionUtil'
import {findHeaderGroupForQuery} from '../../lib/queryUtil'
import apiClient from '../../config/apiClient'
import {trackDownloadCompareAll, trackDownloadCompareSimilar} from '../../actions/tracking'
import toVismaQuery from '../../lib/api-client/utils/toVismaQuery'
import toVismaCompareQuery from '../../lib/api-client/utils/toVismaCompareQuery'
import {toQueryParams} from '../../lib/api-client/visma'
import csvDimensionsBuilder from '../../lib/csvDimensionsBuilder'
import config from '../../config/index'

class DownloadWidget extends Component {
  static propTypes = {
    region: ImdiPropTypes.region.isRequired,
    allRegions: PropTypes.arrayOf(ImdiPropTypes.region),
    query: ImdiPropTypes.query.isRequired,
    headerGroups: PropTypes.array,
    dispatch: PropTypes.func,
    downloadScreenshot: PropTypes.func,
    downloadPNG: PropTypes.func,
    setExplicitView: PropTypes.func,
    chartKind: PropTypes.string
  };

  constructor(props) {
    super()
    this.state = {
      isLoading: false,
      isError: false,
      linkUrl: '',
    }
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

  buildChartQuery(query) {
    // Ensure variables are all arrays
    const dimensions = query.dimensions.map(d => {
      let dimensionVariables = []
      if (Array.isArray(d.variables)) {
        dimensionVariables = d.variables
      } else {
        dimensionVariables = []
        dimensionVariables.push(d.variables)
      }
      d.variables = dimensionVariables
      return d
    })
    query.dimensions = dimensions
    return query
  }

  renderDownloadSelect() {
    const {chartKind} = this.props
    const choices = downloadChoicesByRegion(this.props.region, this.props.allRegions)

    const handApplyChoice = newValue => {
      this.props.dispatch(newValue == 0 ? trackDownloadCompareSimilar() : trackDownloadCompareAll())

      // Show loading overlay while downloading
      this.setState({isLoading: true})

      // csvQuery is the query needed to ask the DB for data
      const csvQuery = this.buildCsvQuery(choices[newValue])
      const isComparing = ((csvQuery.comparisonRegions || []).length > 0)
      const modifiedQuery = isComparing ? toVismaCompareQuery(csvQuery) : toVismaQuery(csvQuery)

      // chartQuery is used by the CSV generator process to build the CSV
      const chartQuery = this.buildChartQuery(this.props.query)

      // Build data object for API call
      const query = {
        csvQuery: JSON.stringify(Object.assign({}, toQueryParams(modifiedQuery))),
        chartQuery: JSON.stringify(chartQuery),
        dimensionLabels: JSON.stringify(csvDimensionsBuilder()),
      }

      console.log({query})

      // Call node server for CSV file
      apiClient.getCsvFile(query).then(response => {
        this.setState({
          isError: false,
          isLoading: false,
          linkUrl: encodeURI(`//${config.nodeApiHost}/api/csv/download/${response.body}/${this.props.query.tableName}`)
        })

      }).catch(() => {
        this.setState({
          isLoading: false,
          isError: true,
        })
      })
    }

    const handleCancelDownloadSelect = () => this.setState({isDownloadSelectOpen: false})

    return (
      <PopupChoicesBox
        downloadScreenshot={this.props.downloadScreenshot}
        setExplicitView={this.props.setExplicitView}
        onCancel={handleCancelDownloadSelect}
        onApply={handApplyChoice}
        isLoading={this.state.isLoading}
        isError={this.state.isError}
        linkUrl={this.state.linkUrl}
        downloadPNG={this.props.downloadPNG}
        choices={choices}
        chartKind={chartKind}
        applyButtonText="Last ned tallgrunnlag (.csv)"
        title="Last ned tallgrunnlag"
        choiceLabel="Velg innhold"
        description="Tallgrunnlaget kan lastes ned som en CSV fil som kan åpnes i blant annet Microsoft Excel."
        screenShotTitle="Last ned skjermbilde"
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
