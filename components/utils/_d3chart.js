import d3 from 'd3'
const d3Chart = {}

d3Chart.create = function (el, props, state, drawPoints, margins = {left: 40, top: 40, right: 40, bottom: 40}) {
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

d3Chart._drawPoints = function () {}

d3Chart.update = function (el, state) {
  this._drawPoints(el, state.data)
}

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
}

export default d3Chart
