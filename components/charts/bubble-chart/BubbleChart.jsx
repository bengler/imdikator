import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'
import {queryResultFilter} from '../../../lib/queryResultFilter'
import {colorLabels} from '../../../data/colorPalette'

const INT_MAX = 9007199254740991

export default class BubbleChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    description: React.PropTypes.string,
    title: React.PropTypes.string,
    source: React.PropTypes.string,
    measuredAt: React.PropTypes.string,
    explicitView: React.PropTypes.bool,
    thisCard: React.PropTypes.bool,
    activeTab: React.PropTypes.bool
  };

  calculateHeight(el) {
    return el.getBoundingClientRect().width
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const diameter = [this.size.width, this.size.height]
    const dimensions = data.dimensions.slice()
    if (!dimensions.find(item => item.name === 'region')) {
      const regionDim = {name: 'region', variables: []}
      dimensions.unshift(regionDim)
    }

    const dimensionLabels = dimensions.map(item => item.name)

    const filteredData = queryResultFilter(data.rows, 'bubble')
    const preparedData = nestedQueryResultLabelizer(queryResultNester(filteredData, dimensions), dimensionLabels)

    const multipleRegions = preparedData.length > 1
    // Prepare needed data
    const regions = d3.set()
    const textures = this.textures
    const colors = this.colors
    preparedData.forEach(row => {
      regions.add(row.title)
      textures.domain(regions.values())
      colors.domain(regions.values())
      row.fill = textures(row.title)
      row.strokeWidth = multipleRegions ? 1 : 0
      row.stroke = 'none'
      let minVal = INT_MAX
      let maxVal = 0
      row.children = row.values.map(item => {
        let fill = textures(row.title)
        let textFill = colorLabels[colors(row.title)]
        let stroke = 'none'
        if (item.values[0].anonymized) {
          fill = 'white'
          stroke = colors(row.title)
          textFill = 'black'
        }
        const anon = item.values[0].anonymized

        const value = anon ? 4 : item.values[0].value
        // console.info(value)
        if (value > maxVal) {
          maxVal = value
        }
        if (value < minVal) {
          minVal = value
        }

        if (item.values[0].missingData) {
          return null
        }

        return {
          title: item.title,
          formattedValue: item.values[0].formattedValue || item.values[0].value,
          value: value,
          stroke: stroke,
          fill: fill,
          strokeWidth: anon ? 1 : 0,
          textFill: textFill
        }
      }).filter(Boolean)
      row.opacityScale = d3.scale.linear().range([0.5, 1.0]).domain([minVal, maxVal])
    })

    const bubble = d3.layout.pack()
    .sort(null)
    .size(diameter)
    .padding(2)

    const nodes = bubble.nodes({fill: 'white', children: preparedData}).filter(item => !item.children)

    const node = this.svg.selectAll('.chart__node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'chart__node')
      .attr('transform', item => this.translation(item.x, item.y))

    let hoveropen = false
    const open = item => {
      if (item.depth < 1) {
        return
      }
      if (item.depth == 1 && !multipleRegions) {
        return
      }
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: item.formattedValue,
        el: item.el
      })
      hoveropen = true
    }
    const close = item => {
      if (item.depth < 1) {
        return
      }
      this.eventDispatcher.emit('datapoint:hover-out')
      hoveropen = false
    }

    node
//     .append('svg:a')
//     .attr('xlink:href', 'javascript://') // eslint-disable-line no-script-url
//     .attr('aria-label', item => item.title + ' ' + item.formattedValue) // For screenreaders
//     .on('click', () => d3.event.stopPropagation())
//     .on('focus', item => open(item))
    .append('circle')
    .attr('r', item => item.r)
    .style('fill', item => item.fill)
    /* Fjernet til vi får fikset kontrastproblemene ved bruk av lys farge
    .style('fill-opacity', item => {
      const opacityScale = item.parent.opacityScale
      const opacity = opacityScale(item.value)
      return opacity
    })
    */
    .style('stroke', item => item.stroke)
    .style('stroke-width', item => item.strokeWidth)
    .each(function (dataItem) {
      dataItem.el = this
    })
    .on('touchend', item => {
      if (hoveropen) {
        close(item)
      } else {
        open(item)
      }
    })
    .on('mouseover', item => open(item))
    .on('mouseout', item => close(item))

    node.append('text')
    .attr('dy', '.3em')
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .style('fill', item => item.textFill)
    .style('pointer-events', 'none')
    .style('font-size', item => {
      if (item.r <= 40) {
        return '13px'
      }
      return '18px'
    })
    .style('display', item => {
      if (item.r <= 8) {
        return 'none'
      }
      return ''
    })
    .text(item => {
      if (item.depth <= 1 || !item.title) {
        return null
      }
      return item.title.substring(0, item.r / 4) // eslint-disable-line id-length
    })

    const leg = this.legend().color(textures)
    // Add some space between the x axis labels and the legends
    /* eslint-disable prefer-reflect */
    const legendWrapper = this.svg.append('g')
    .attr('class', 'chart__legend-wrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .datum(regions.values())
    .call(leg)
    /* eslint-enable prefer-reflect */

    legendWrapper.attr('transform', () => this.translation(0, this.size.height))

    // Expand the height to fit the legend
    const expandedHeight = this.fullHeight + leg.height()
    this._svg
    .attr('height', expandedHeight)
    .attr('viewBox', `0 0 ${this.fullWidth} ${expandedHeight}`)
  }

  render() {
    const {data, explicitView, title, source, measuredAt, description, thisCard, activeTab} = this.props

    const functions = {
      drawPoints: this.drawPoints,
      calculateHeight: this.calculateHeight
    }
    const config = {
      shouldCalculateMargins: false
    }

    return (
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
      />
    )
  }
}
