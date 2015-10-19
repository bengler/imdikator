import d3 from 'd3'
import {colors, colorTextures} from '../../data/colorPalette'

class Chart {
  constructor(el, props, state, eventEmitter, functions) {
    // _svg is the actual SVG element
    this._svg = null
    // svg is a translated 'g' within _svg that all graphs draw to
    this.svg = null

    this.props = props
    this.colors = d3.scale.ordinal().range(colorPalette)
    this.eventDispatcher = eventEmitter

    if (functions) {
      if (functions.hasOwnProperty('drawPoints')) {
        this._drawPoints = functions.drawPoints
      }
      if (functions.hasOwnProperty('calculateHeight')) {
        this._calculateHeight = functions.calculateHeight
      }
      if (functions.hasOwnProperty('calculateMargins')) {
        this._calculateMargins = functions.calculateMargins
      }
    }

    this.update(el, state)
  }

  _drawPoints(el, data) {}

  _calculateMargins(data) {
    return {}
  }

  _calculateHeight(data) {
    return 400
  }

  update(el, state) {
    // We don't support redrawing on top of old graphs, so just remove any
    // previous presentation
    if (this._svg) {
      this._svg.remove()
    }

    // Our width is determined by our element width
    this.fullWidth = el.offsetWidth
    const defaultMargins = {left: 60, top: 5, right: 5, bottom: 0}
    this.margins = Object.assign({}, defaultMargins, this._calculateMargins(state.data))
    const height = this._calculateHeight() + this.margins.top + this.margins.bottom

    this.size = {
      width: this.fullWidth - this.margins.left - this.margins.right,
      height: height - this.margins.top - this.margins.bottom
    }

    // TODO: https://css-tricks.com/scale-svg/
    // http://stackoverflow.com/a/9539361/194404
    this._svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', this.fullWidth)
      .attr('height', height)

    // Visualize SVG
    this._svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', this.fullWidth)
    .attr('height', height)
    .style('fill', '#ccc')
    // TODO: Make vertical space for potential X axis labels (might line break)
    // TODO: Make horizontal space for potential Y axis with formatted labels

    // Now that we have a SVG element, we can create textures
    // They are added as <defs><pattern> nodes to the SVG and
    // referred to by an url(). We can then use it as a fill
    const textureFills = []
    colors.forEach(color => {
      let fill = color
      const textureFunc = colorTextures[color]
      if (textureFunc) {
        const tx = textureFunc()
        this._svg.call(tx) // eslint-disable-line prefer-reflect
        fill = tx.url()
      }
      textureFills.push(fill)
    })
    this.textures = d3.scale.ordinal().range(textureFills)

    // Conventional margins (http://bl.ocks.org/mbostock/3019563)
    // Translating an outer 'g' so we dont have to consider margins in the rest
    // of the code
    this.svg = this._svg.append('g')
      .attr('class', 'd3-points')
      .attr('transform', this.translation(this.margins.left, this.margins.top))

    // Visualize svg with margins
    this.svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', this.size.width)
    .attr('height', this.size.height)
    .style('fill', '#655959')

    this._drawPoints(el, state.data)
  }

  destroy(el) {
  }

  translation(x, y) {
    return `translate(${x},${y})`
  }

  unitFormatter(unit) {
    let format = d3.format('g')
    let axisFormat = d3.format('g')
    switch (unit) {
      case 'prosent': {
        format = d3.format('.2%')
        axisFormat = d3.format('%')
        break
      }
      case 'promille': {
        const _format = d3.format('.2g')
        format = function (val) {
          return _format(val) + '‰'
        }
        axisFormat = format
        break
      }
      case 'kroner': {
        const _format = d3.format('s')
        axisFormat = function (val) {
          return `${_format(val)} kr`
        }
        format = function (val) {
          return `${d3.format('g')(val)} kr`
        }
        break
      }
      default: {
        break
      }
    }

    return {axisFormat, format}
  }

  // Returns {scale: d3.scale, format: tickFormat}
  configureYscale(extent, unit) {
    const maxValue = extent[1] < 0 ? 0 : extent[1]
    const y = d3.scale.linear().range([this.size.height, 0])
    switch (unit) {
      case 'prosent': {
        y.domain([0, Math.max(1, maxValue)])
        break
      }
      case 'promille': {
        y.domain([0, maxValue])
        break
      }
      case 'kroner': {
        y.domain([0, maxValue])
        break
      }
      default: {
        y.domain([Math.min(0, extent[0]), maxValue])
      }
    }
    return Object.assign({
      scale: y
    }, this.unitFormatter(unit))
  }

  legend() {
    let color = d3.scale.category20()
    const attr = {
      width: (item, idx) => 15,
      height: (item, idx) => 15,
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

        const parent = d3.select(wrap.node().parentNode)
        const maxWidth = parent.attr('width') - attr.width() - 5

        legend
          .append('text')
          .text(dataItem => dataItem)
          .attr('y', () => attr.height())
          .attr('dy', () => 0)
          .attr('font-size', () => attr.height())
          .attr('x', (node, index) => attr.width() * 1.5)

        legend.selectAll('text')
        .call(wrapper, maxWidth)

        let x = 0
        let y = 0
        wrap.selectAll('g').each(function () {
          const el = d3.select(this)
          el.attr('transform', `translate(${x}, 0)`)
          const bbox = el.node().getBBox()
          const width = bbox.width + attr.width()
          const newX = x + width
          if (newX > maxWidth) {
            x = width
            y += bbox.height
          } else {
            x += width
          }
          el.attr('transform', `translate(${x - width}, ${y - bbox.height})`)
        })
      })
      return chart
    }

    chart.dispatch = dispatch

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
