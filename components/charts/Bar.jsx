const React = require("react");

const c3 = require('c3');

module.exports = React.createClass({
  displayName: 'AreaChart',
  onClick() {

  },
  componentDidMount() {
    this.chart = c3.generate({
      bindto: this.getDOMNode(),
      data: {
        json: []
      },
      axis: {
        x: {
          type: 'category'
        }
      }
    });
    this.renderChart();
  },
  componentDidUpdate() {
    this.renderChart();
  },
  renderChart() {
    const firstDimension = this.props.data[this.props.item.dimensions[0].label];
    const firstGroups = Object.keys(firstDimension);
    const secondDimensionName = this.props.item.dimensions[1].label;
    const secondGroups = Object.keys(firstDimension[firstGroups[0]][secondDimensionName]);

    let chartData = {}
    secondGroups.forEach((second)=> {
      chartData[second] = []
      firstGroups.forEach((first)=> {
        chartData[second].push(firstDimension[first][secondDimensionName][second].personer)
      });
    });

    // console.info(groups);
    // console.info(chartData);

    this.chart.load({
      json: chartData,
      type: "bar",
      categories: firstGroups,
    });

    this.chart.groups([secondGroups]);

  },
  render() {
    return <div/>
  }
});
