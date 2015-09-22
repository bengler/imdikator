import d3 from 'd3'

class Chart {
  constructor(el, props, state, drawPoints, margins = {left: 40, top: 40, right: 40, bottom: 40}) {

    // TODO: https://css-tricks.com/scale-svg/
    const svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', props.width)
    .attr('height', props.height)

    // Conventional margins (http://bl.ocks.org/mbostock/3019563)
    // Translating an outer 'g' so we dont have to consider margins in the rest
    // of the code
    svg.append('g')
    .attr('class', 'd3-points')
    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

    this.svg = d3.select(el).select('svg g')

    this.size = {
      width: el.offsetWidth - margins.left - margins.right,
      height: el.offsetHeight - margins.top - margins.bottom
    }

    this.margins = margins

    this._drawPoints = drawPoints
    this.update(el, state)

  }

  _drawPoints(el, data) {

  }

  update(el, state) {
    this._drawPoints(el, state.data)
  }

  destroy(el) {

  }

  legend() {
    let color = d3.scale.category20()
    const attr = {
      width: (item, idx) => 15,
      height: (item, idx) => 15,
    }
    const dispatch = d3.dispatch('legendClick', 'legendMouseover', 'legendMouseout')

    function chart(selection) {
      selection.each(function (data, idx) {

        const wrap = d3.select(this).selectAll('g.legend').data(data)
        let legend = null
        legend = wrap.enter()
        .append('g').attr('class', 'legend')
        .append('g')
        .on('click', function (item, index) {
          dispatch.legendClick(item, index)
        })
        .on('mouseover', function (item, index) {
          dispatch.legendMouseover(item, index)
        })
        .on('mouseout', function (item, index) {
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

        legend
        .append('text')
        .text(dataItem => dataItem)
        .attr('dy', () => attr.height())
        .attr('font-size', () => attr.height())
        .attr('x', (node, index) => attr.width() * 1.5)

        let x = 0
        let y = 0
        const parent = d3.select(wrap.node().parentNode)
        const maxWidth = parent.attr('width')

        wrap.selectAll('g').each(function () {
          const el = d3.select(this)
          el.attr('transform', 'translate(' + x + ', 0)')
          const bbox = el.node().getBBox()
          const width = bbox.width + attr.width()
          const newX = x + width
          if (newX > maxWidth) {
            x = width
            y += attr.height() + attr.height() * 0.5
          } else {
            x += width
          }
          el.attr('transform', 'translate(' + (x - width) + ', ' + y + ')')
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
      const words = txt.text().split(/\s+/).reverse()
      const lineHeight = 1.1 // ems
      const y = txt.attr('y')
      const dy = parseFloat(txt.attr('dy'))
      let word = null
      let line = []
      let lineNumber = 0
      let tspan = txt.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em')
      word = words.pop()
      while (word) {
        line.push(word)
        tspan.text(line.join(' '))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(' '))
          line = [word]
          tspan = txt.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
        }
        word = words.pop()
      }
    })
  }
}

export default Chart
