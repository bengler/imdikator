import React from 'react'
import d3 from 'd3'

import D3Chart from '../../utils/D3Chart'
import CHARTS_CONFIG from '../../../config/chartsConfigs'
import { queryResultNester, nestedQueryResultLabelizer } from '../../../lib/queryResultNester'

export default class BarChart extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
    className: React.PropTypes.string,
    minimalHeight: React.PropTypes.bool,
    explicitView: React.PropTypes.bool,
    title: React.PropTypes.string,
    source: React.PropTypes.string,
    measuredAt: React.PropTypes.string,
    description: React.PropTypes.string,
    printView: React.PropTypes.bool,
    thisCard: React.PropTypes.any
  }

  prepareData(data) {
    const dimensions = data.dimensions.slice()
    if (dimensions.length == 1) {
      // Add a needed second dimension
      dimensions.unshift({ name: 'region', variables: [] })
    }

    const dimensionLabels = dimensions.map(item => item.name)
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensions), dimensionLabels)
    preparedData.extent = d3.extent(data.rows, item => parseFloat(item.value))

    return {
      unit: data.unit,
      preparedData
    }
  }

  calculateHeightLarge(el) {
    return 400
  }

  calculateHeightSmall(el) {
    return 250
  }

  calculateWidth(el, data) {
    const numCategories = data.preparedData.length
    const minWidth = numCategories * CHARTS_CONFIG.bar.minWidthPerCategory
    d3.select(el)
      .style('min-width', `${minWidth}px`)

    if (el.offsetWidth < minWidth) {
      return minWidth
    }
    return el.offsetWidth
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const {explicitView, title, source, measuredAt, description, printView} = this.props

    //  d3 doesn't like arrow functions
    d3.select('.button.download__svg').on('click', function () {
      const config = { filename: 'imdi-diagram' }
      d3_save_svg.save(d3.select('svg').node().parentNode.innerHTML, config)
    })

    const svg = this.svg

    const categories = data.preparedData.map(entry => entry.title)
    // Set a minimum width

    // X axis scale for categories
    let x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    const xScales = {}
    let innerPaddingFactor = 0.5
    let outerPaddingFactor = 0.5

    // untoggle below to get more width between bars
    // if (explicitView) {
    //   x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([220, this.size.width * 2], -1)
    //   innerPaddingFactor = 0.6
    //   outerPaddingFactor = 0.8
    // }

    const maxWidth = CHARTS_CONFIG.bar.maxBarWidth

    data.preparedData.forEach(cat => {
      const catSeries = cat.values.map(val => val.title)
      const scale = d3.scale.ordinal()
      .domain(catSeries)
      .rangeRoundBands([0, x0.rangeBand()], innerPaddingFactor, outerPaddingFactor)

      // untoggle below to get more width between bars
      // if (explicitView) {
      //   scale = d3.scale.ordinal()
      //   .domain(catSeries)
      //   .rangeRoundBands([100, x0.rangeBand() - 200], innerPaddingFactor, outerPaddingFactor)
      // }

      this.limitScaleRangeBand(scale, maxWidth)
      xScales[cat.key] = scale
    })

    // Y config
    const yc = this.configureYscale(data.preparedData.extent, data.unit)

    // A range of 20 colors
    let seriesColor = this.textures
    // Clear the domain
    seriesColor.domain([])

    // Get the unique categories from the data
    const series = []
    data.preparedData.forEach(item => {
      item.values.forEach(val => {
        // Expand the color domain if this is a new series
        if (series.indexOf(val.title) == -1) {
          series.push(val.title)
        }
        seriesColor = seriesColor.domain(series)

        // Category specific X scale
        val.scale = xScales[item.key]

        // Different handling of anonymized data
        if (val.values[0].anonymized) {
          val.fill = 'none'
          val.stroke = seriesColor(val.title)
          val.strokeWidth = 2
        } else if (val.values[0].missingData) {
          val.fill = 'none'
          val.stroke = 'none'
          val.strokeWidth = 2
        } else {
          val.fill = seriesColor(val.title)
          val.stroke = 'none'
          val.strokeWidth = 0
        }

        val.value = val.values[0].value
        val.formattedValue = val.values[0].formattedValue
        if (!val.formattedValue) {
          val.formattedValue = yc.format(val.values[0].value)
        }
      })
    })

    this.addYAxis(yc.scale, yc.axisFormat)

    const category = svg.selectAll('.chart__category')
      .data(data.preparedData)
      .enter()
      .append('g')
      .attr('class', 'chart__category')
      .attr('transform', dataItem => this.translation(x0(dataItem.title), 0)) // moves each category to the right

    category.selectAll('rect.chart__bar')
      .data(dataItem => dataItem.values)
      .enter()
      .append('rect')
      .attr('class', 'chart__bar')
      .attr('width', item => item.scale.rangeBand())
      .attr('x', dataItem => dataItem.scale(dataItem.title))
      .attr('y', dataItem => {
        const val = Math.max(0, dataItem.value)
        return yc.scale(val)
      })
      .attr('height', dataItem => Math.abs(yc.scale(0) - yc.scale(dataItem.value)))
      .style('fill', dataItem => dataItem.fill)
      .style('stroke', dataItem => dataItem.stroke)
      .style('stroke-width', dataItem => dataItem.strokeWidth)
      .each(function (item) {
        item.el = this
      })

    let hoveropen = false

    const open = item => {
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: item.formattedValue,
        el: item.el
      })
      hoveropen = true
    }

    const close = () => {
      this.eventDispatcher.emit('datapoint:hover-out')
      hoveropen = false
    }

    //================================================
    //  if user has toggled button for showing numbers above graphs
    //================================================
    if (explicitView) {

      // Add text indicators
      category.selectAll('rect.chart__text')
      .data(dataItem => dataItem.values)
      .enter()
      .append('text')
      .attr('class', 'chart__text')
      .attr('width', item => item.scale.rangeBand())
      .attr('x', dataItem => dataItem.scale(dataItem.title))
      .attr('y', dataItem => {
        const val = Math.max(0, dataItem.value)
        return yc.scale(val)
      })
      .attr('height', dataItem => Math.abs(yc.scale(0) - yc.scale(dataItem.value)))
      .each(function (item) {
        item.el = this
      })
      .text(dataItem => dataItem.formattedValue)
    }

    //================================================
    //  hovered chart bars shows numbers
    //================================================
    else {
      category.selectAll('rect.chart__bar-hover')
        .data(dataItem => dataItem.values)
        .enter()
        .append('svg:a')
        .attr('xlink:href', 'javascript://') // eslint-disable-line no-script-url
        .attr('aria-label', item => item.title + ' ' + item.formattedValue) // For screenreaders
        .on('click', () => d3.event.stopPropagation())
        .on('focus', item => open(item))
        .append('rect')
        .attr('class', 'chart__bar-hover')
        .attr('width', item => item.scale.rangeBand())
        .attr('x', dataItem => dataItem.scale(dataItem.title))
        // Want full height for this one
        .attr('y', 0)
        .attr('height', () => this.size.height - yc.scale(yc.scale.domain()[1]))
        .attr('pointer-events', 'all')
        .style('fill', 'none')
        .on('touchend', item => {
          if (hoveropen) {
            close()
          } else {
            open(item)
          }
        })
        .on('mouseover', item => open(item))
        .on('mouseout', () => close())
        .on('focus', item => open(item))
        .on('blur', () => close())
    }

    /* eslint-disable prefer-reflect */
    // Add the x axis legend
    const xAxis = d3.svg.axis()
      .scale(x0)
      .orient('bottom')
      .innerTickSize(10)

    const xAxisEl = svg.append('g')
      .attr('class', 'chart__axis chart__axis--category')
      .attr('transform', this.translation(0, this.size.height))
      .call(xAxis)

    // Remove default X axis line (in case we translated up to make room
    // for negative values)
    xAxisEl.select('path').remove()

    const txts = xAxisEl.selectAll('.tick text')
    txts.call(this.wrapTextNode, x0.rangeBand())

    const leg = this.legend().color(seriesColor)

    // Add some space between the x axis labels and the legends
    const legendWrapper = this._svg.append('g')
      .attr('class', 'chart__legend-wrapper')
      .attr('width', this.fullWidth)
      // Place it at the very bottom
      .datum(series)
      .call(leg)
    /* eslint-enable prefer-reflect */

    // Add some space between the x axis labels and the legends
    const xAxisHeight = xAxisEl.node().getBBox().height + 21
    const legendBottom = this.fullHeight + xAxisHeight
    legendWrapper.attr('transform', () => this.translation(0, legendBottom))

    // Expand the height to fit the legend
    const expandedHeight = this.fullHeight + xAxisHeight + leg.height()
    this._svg
      .attr('height', expandedHeight)
      .attr('viewBox', `0 0 ${this.fullWidth} ${expandedHeight}`)

    // Add zero-line
    this.svg
      .append('line')
      .attr('class', 'chart__line chart__line--zero')
      .attr('x1', -this.margins.left)
      .attr('x2', this.fullWidth)
      .attr('y1', yc.scale(0))
      .attr('y2', yc.scale(0))
  }

  render() {
    const {explicitView, title, source, measuredAt, description, thisCard, activeTab} = this.props
    const extraPadding = 70
    const functions = {
      drawPoints: this.drawPoints,
      calculateWidth: this.calculateWidth,
      calculateHeight: this.props.minimalHeight ? this.calculateHeightSmall : this.calculateHeightLarge
    }

    const data = this.prepareData(this.props.data)

    const config = {
      shouldCalculateMargins: true
    }

    if (CHARTS_CONFIG.bar.minWidthPerCategory) {
      const numCategories = data.preparedData.length
      config.minimumWidth = numCategories * (CHARTS_CONFIG.bar.minWidthPerCategory + extraPadding)
    }

    return (
      <div>
        <D3Chart
          data={data}
          config={config}
          functions={functions}
          explicitView={explicitView}
          activeTab={activeTab}
          title={title}
          source={source}
          measuredAt={measuredAt}
          description={description}
          thisCard={thisCard}
          className={this.props.className}
        />
      </div>
    )
  }
}
