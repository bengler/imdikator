const React = require("react");
const d3 = require('d3');

// part of http://bl.ocks.org/mbostock/4063269
const flare = require("./flare.json");
// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  const classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

module.exports = React.createClass({
  displayName: 'AreaChart',
  componentDidMount() {
    this.renderChart();
  },
  componentDidUpdate() {
    this.renderChart();
  },
  renderChart() {
    const diameter = 960;
    const format = d3.format(",d");
    const color = d3.scale.category20c();

    const bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .padding(1.5);

    const svg = d3.select(this.getDOMNode()).append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

    const node = svg.selectAll(".node")
      .data(bubble.nodes(classes(flare))
        .filter(d => !d.children))
        .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", d => `translate(${d.x},${d.y})`);

      node.append("title")
        .text(d => d.className + ": " + format(d.value));

      node.append("circle")
        .attr("r", d => d.r)
        .style("fill", d => color(d.packageName));

      node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(d => d.className.substring(0, d.r / 3));

  },
  render() {
    return <div/>
  }
});
