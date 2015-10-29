import d3 from 'd3'
import {colors, colorTextures} from '../../data/colorPalette'
import {unitFormatter as _unitFormatter} from '../../lib/unitFormatter'

const showMargins = false

class Chart {
  constructor(el, props, state, functions, config) {
    // _svg is the actual SVG element
    this._svg = null
    // svg is a translated 'g' within _svg that all graphs draw to
    this.svg = null

    this.props = props
    this.colors = d3.scale.ordinal().range(colors)
    this.eventDispatcher = config.eventEmitter

    if (functions) {
      if (functions.hasOwnProperty('drawPoints')) {
        this._drawPoints = functions.drawPoints
      }
      if (functions.hasOwnProperty('calculateHeight')) {
        this._calculateHeight = functions.calculateHeight
      }
    }

    this.update(el, state, config)
  }

  _drawPoints(el, data) {}

  _calculateMargins(data) {
    if (!data) {
      return null
    }

    if (!data.preparedData) {
      return {}
    }

    // LEFT MARGIN
    // Need to add a Y axis and see how wide the largest label is
    const yc = this.configureYscale(data.preparedData.extent, data.unit, 100)
    const testSVG = d3.select('body').append('svg').style('display', 'hidden')
    const yAxis = d3.svg.axis().scale(yc.scale).orient('left').tickFormat(yc.axisFormat)
    testSVG.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    // Find the longest text string on this axis
    let axislabelLength = 0
    let axislabelHeight = 0
    testSVG.selectAll('text').each(function () {
      const height = d3.select(this).node().getBBox().height
      if (height > axislabelHeight) {
        axislabelHeight = height
      }
      const len = this.getComputedTextLength()
      if (len > axislabelLength) {
        axislabelLength = len
      }
    })

    testSVG.remove()

    const result = {
      left: axislabelLength + 10, // Add some space for the actual axis and tick marks
      top: axislabelHeight,
      right: 15
    }
    return result
  }

  _calculateHeight(el) {
    return 400
  }

  update(el, state, config) {
    // We don't support redrawing on top of old graphs, so just remove any
    // previous presentation
    if (this._svg) {
      this._svg.remove()
    }

    // Our width is determined by our element width
    this.fullWidth = el.offsetWidth
    const defaultMargins = {left: 0, top: 0, right: 0, bottom: 0}
    this.margins = defaultMargins
    if (config.shouldCalculateMargins) {
      this.margins = Object.assign(defaultMargins, this._calculateMargins(state.data))
    }
    this.fullHeight = this._calculateHeight(el) + this.margins.top + this.margins.bottom

    this.size = {
      width: this.fullWidth - this.margins.left - this.margins.right,
      height: this.fullHeight - this.margins.top - this.margins.bottom
    }

    // TODO: https://css-tricks.com/scale-svg/
    // http://stackoverflow.com/a/9539361/194404
    this._svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', this.fullWidth)
      .attr('height', this.fullHeight)

    if (showMargins) {
      // Visualize SVG
      this._svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.fullWidth)
      .attr('height', this.fullHeight)
      .style('fill', '#ccc')
      // TODO: Make vertical space for potential X axis labels (might line break)
      // TODO: Make horizontal space for potential Y axis with formatted labels
    }

    // Now that we have a SVG element, we can create textures
    // They are added as <defs><pattern> nodes to the SVG and
    // referred to by an url(). We can then use it as a fill
    const textureFills = []
    const textureColors = Object.keys(colorTextures)
    textureColors.forEach(color => {
      let fill = color
      const textureFunc = colorTextures[color]
      if (textureFunc) {
        const tx = textureFunc()
        this._svg.call(tx) // eslint-disable-line prefer-reflect
        fill = tx.url()
      }
      textureFills.push(fill)
    })
    this.textures = d3.scale.ordinal().range(textureFills).domain(textureColors)

    // Conventional margins (http://bl.ocks.org/mbostock/3019563)
    // Translating an outer 'g' so we dont have to consider margins in the rest
    // of the code
    this.svg = this._svg.append('g')
      .attr('class', 'd3-points')
      .attr('transform', this.translation(this.margins.left, this.margins.top))

    // Visualize svg with margins
    if (showMargins) {
      this.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.size.width)
      .attr('height', this.size.height)
      .style('fill', '#655959')
    }

    this._drawPoints(el, state.data)
  }

  destroy(el) {
  }

  translation(x, y) {
    return `translate(${x},${y})`
  }

  unitFormatter(unit) {
    return _unitFormatter(unit)
  }

  limitScaleRangeBand(scale, limit) {
    const domain = scale.domain()
    while (scale.rangeBand() > limit) {
      domain.push(Math.random())
      domain.unshift(Math.random())
      scale.domain(domain)
    }
    return scale
  }

  // Returns {scale: d3.scale, format: tickFormat}
  configureYscale(extent, unit, height = this.size.height) {
    const maxValue = extent[1] < 0 ? 0 : extent[1]
    const y = d3.scale.linear().range([height, 0])
    switch (unit) {
      case 'prosent': {
        // Always 0 -> (100% or > 100%)
        y.domain([0, Math.max(1, maxValue)])
        break
      }
      case 'promille': {
        // Always 0 -> max
        y.domain([0, maxValue])
        break
      }
      default: {
        // Always 0 or < 0 -> max
        y.domain([Math.min(0, extent[0]), maxValue])
      }
    }
    return Object.assign({
      scale: y
    }, this.unitFormatter(unit))
  }

  addYAxis(scale, format) {
    scale.nice()

    const yAxis = d3.svg.axis().scale(scale).orient('left')
    yAxis.tickFormat(format)

    /* eslint-disable prefer-reflect */
    this.svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .select('path').remove()
    /* eslint-enable prefer-reflect */

    // Draw horizontal background lines where the tick marks are
    this.svg.selectAll('.axis .tick')
    .append('line')
    .attr('class', 'benchmark--line')
    .attr('x1', -this.margins.left)
    .attr('x2', this.fullWidth)
    .attr('y1', 0)
    .attr('y2', 0)

    // Translate the text up by half font size to make the text rest on top
    // of the background lines
    this.svg.selectAll('.axis .tick text')
    .attr('transform', function () {
      return `translate(0, ${-this.getBBox().height / 2})`
    })
    .attr('class', 'benchmark--text')
  }

  legend() {
    let color = d3.scale.category20()
    let height = 0
    const attr = {
      width: (item, idx) => 20,
      height: (item, idx) => 20,
      fontSize: (item, idx) => 15
    }
    const dispatch = d3.dispatch('legendClick', 'legendMouseover', 'legendMouseout')
    const wrapper = this.wrapTextNode

    function chart(selection) {
      selection.each(function (data, idx) {
        if (data.length < 1) {
          // Dont show single legends or none
          return
        }

        const wrap = d3.select(this).selectAll('g.legend').data(data)
        let legend = null
        legend = wrap.enter()
          .append('g').attr('class', 'legend')
          .attr('transform', `translate(0,0)`)
          .append('g')
          .on('click', (item, index) => {
            dispatch.legendClick(item, index)
          })
          .on('mouseover', (item, index) => {
            dispatch.legendMouseover(item, index)
          })
          .on('mouseout', (item, index) => {
            dispatch.legendMouseout(item, index)
          })

        legend.append('rect')
          .attr('x', (dataItem, index) => {
            return 0
          })
          .attr('y', 0)
          .attr('width', (item, i) => attr.width(item, i))
          .attr('height', (item, i) => attr.height(item, i))
          .style('fill', dataItem => color(dataItem))

        const textX = attr.width() + attr.fontSize() / 2
        const parent = d3.select(wrap.node().parentNode)
        const maxWidth = parent.attr('width') - textX

        legend
          .append('text')
          .text(dataItem => dataItem)
          .attr('y', () => (attr.height() - attr.fontSize()) / 2)
          .attr('dy', () => 0)
          .attr('x', 0)
          .attr('dx', textX)
          .attr('text-anchor', 'start')
          .attr('font-size', () => attr.fontSize())
          .attr('dominant-baseline', 'text-before-edge')

        // Wrap lines
        legend.selectAll('text').call(wrapper, maxWidth)

        let x = 0
        let y = 0
        let previousHeight = 0
        const heightMargin = attr.height()
        wrap.selectAll('g').each(function () {
          const el = d3.select(this)
          const bbox = el.node().getBBox()
          const width = bbox.width + attr.width()
          const newX = x + width
          if (newX > maxWidth) {
            x = width
            y += previousHeight + heightMargin
          } else {
            x += width
          }
          el.attr('transform', `translate(${x - width}, ${y})`)
          previousHeight = bbox.height
        })
        height = y + previousHeight
      })
      return chart
    }

    chart.dispatch = dispatch

    chart.height = function () {
      return height
    }

    chart.color = function (newColor) {
      if (!arguments.length) {
        return color
      }
      color = newColor
      return chart
    }

    chart.attr = function (key, newValue) {
      if (!arguments.length) {
        return attr
      }
      if (arguments.length == 1) {
        const value = attr[key]
        if (typeof value === 'function') {
          return value()
        }
        return value
      }
      attr[key] = newValue
      return chart
    }

    return chart
  }

  // Wrapping text nodes
  // https://gist.github.com/mbostock/7555321
  wrapTextNode(text, width) {
    text.each(function () {
      const txt = d3.select(this)
      const words = txt.text()
      .split(/\s+/)
      .reverse()
      const lineHeight = 1.1 // ems
      const y = txt.attr('y')
      const x = txt.attr('x')
      const dy = parseFloat(txt.attr('dy'))
      let dx = parseFloat(txt.attr('dx'))
      if (isNaN(dx)) {
        dx = 0
      }
      let word = null
      let line = []
      let lineNumber = 0
      let tspan = txt.text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', `${dy}em`)
      word = words.pop()
      while (word) {
        line.push(word)
        tspan.text(line.join(' '))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(' '))
          line = [word]
          tspan = txt.append('tspan')
          .attr('x', 0)
          .attr('dx', dx)
          .attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word)
        }
        word = words.pop()
      }
    })
  }
}

export default Chart
