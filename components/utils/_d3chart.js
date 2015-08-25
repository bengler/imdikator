import d3 from 'd3'
const d3Chart = {}

d3Chart.create = function (el, props, state, drawPoints, scales) {
  const svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', props.width)
    .attr('height', props.height)

  svg.append('g')
    .attr('class', 'd3-points')


  this._drawPoints = drawPoints
  this._scales = scales
  this.update(el, state)
}

d3Chart._drawPoints = function () {}
d3Chart._scales = function () {}

d3Chart.update = function (el, state) {
  // Re-compute the scales, and render the data points
  const scales = this._scales(el, state.domain)
  this._drawPoints(el, scales, state.data)
}

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
}

export default d3Chart
