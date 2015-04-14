const React = require("react");
const c3 = require('c3');
const dotty = require('dotty');

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
    console.info(this.props.item.dimensions);
    console.info(this.props.data);

    let dimensions = this.props.item.dimensions;
    let data = this.props.data;

    let chartData = {};
    let firstGroups = []; 

    let cutoff = false;

    if (dimensions.length == 3) {
      cutoff = true;

      data = dotty.search(data, "*.*")[0];
      dimensions = dimensions.slice(1,3);
      console.info("hullo");
    }

    if (dimensions.length == 2) {
      let firstDimension = data[dimensions[0].label];

      firstGroups = Object.keys(firstDimension);
      let secondDimensionName = dimensions[1].label;

      // Assumes nested groups follow same schema. Probes the first key.
      let secondGroups = Object.keys(firstDimension[firstGroups[0]][secondDimensionName]);

      secondGroups.forEach((second)=> {
        chartData[second] = []
        firstGroups.forEach((first)=> {
          chartData[second].push(firstDimension[first][secondDimensionName][second].personer)
        });
      });
      this.chart.groups([secondGroups]);
    }

    // console.info(groups);
    // console.info(chartData);

    this.chart.load({
      json: chartData,
      type: "bar",
      categories: firstGroups,
    });


  },
  render() {
    return <div/>
  }
});
