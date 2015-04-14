const React = require("react");
const d3 = require('d3');

module.exports = React.createClass({
  displayName: 'Bubble',
  componentDidMount() {
    this.renderChart();
  },
  componentDidUpdate() {
    this.renderChart();
  },

  flatten(root) {
    let data = root[this.props.item.dimensions[0].label];
    const classes = [];

    Object.keys(data).forEach((key)=> {
      classes.push( {
        value: data[key].personer[0],
        name: key,
        className: key
      })
    });

    return {children: classes};
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
      .data(bubble.nodes(this.flatten(this.props.data))
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
