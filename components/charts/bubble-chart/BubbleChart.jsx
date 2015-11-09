import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'
import {queryResultFilter} from '../../../lib/queryResultFilter'
import {colorLabels} from '../../../data/colorPalette'

const INT_MAX = 9007199254740991

export default class BubbleChart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: React.PropTypes.object
  }
  /* eslint-enable react/forbid-prop-types */

  calculateHeight(el) {
    return el.getBoundingClientRect().width
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const diameter = [this.size.width, this.size.height]
    if (data.dimensions.indexOf('region') == -1) {
      data.dimensions.unshift('region')
    }

    const dimensionLabels = data.dimensions

    const filteredData = queryResultFilter(data.rows, 'bubble')
    const preparedData = nestedQueryResultLabelizer(queryResultNester(filteredData, dimensionLabels), dimensionLabels)

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
        if (value > maxVal) {
          maxVal = value
        }
        if (value < minVal) {
          minVal = value
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
      })
      row.opacityScale = d3.scale.linear().range([0.5, 1.0]).domain([minVal, maxVal])
    })

    const bubble = d3.layout.pack()
    .sort(null)
    .size(diameter)
    .padding(2)

    const nodes = bubble.nodes({fill: 'white', children: preparedData}).filter(item => !item.children)

    const node = this.svg.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
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
    .append('svg:a')
    .attr('xlink:href', 'javascript://') // eslint-disable-line no-script-url
    .on('click', () => d3.event.stopPropagation())
    .on('focus', item => open(item))
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
    .style('text-anchor', 'middle')
    .style('font-size', '13px')
    .style('fill', item => item.textFill)
    .style('pointer-events', 'none')
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
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .datum(regions.values())
    .call(leg)
    /* eslint-enable prefer-reflect */

    legendWrapper.attr('transform', () => this.translation(0, this.size.height))

    // Expand the height to fit the legend
    this._svg.attr('height', this.fullHeight + leg.height())
  }

  render() {
    const functions = {
      drawPoints: this.drawPoints,
      calculateHeight: this.calculateHeight
    }
    const config = {
      shouldCalculateMargins: false
    }
    return (
      <D3Chart
        data={this.props.data}
        functions={functions}
        config={config}
      />
    )
  }
}
