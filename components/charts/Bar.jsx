const React = require('react');
const c3 = require('c3');
const dotty = require('dotty');
const ProfileColors = require('./ProfileColors');

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
  colorsToDict(variables, colors) {
    let result = {};
    variables.forEach((key, i)=> {
      result[key] = colors[i];
    });
    return result;
  },
  renderChart() {

    let dimensions = this.props.dimensions;
    let data = this.props.data;

    let chartData = {};
    let firstGroups = [];


    if (dimensions.length == 2) {
      let firstDimension = data[dimensions[0].label];

      firstGroups = Object.keys(firstDimension);
      let secondDimensionName = dimensions[1].label;

      // Assumes nested groups follow same schema. Probes the first key.
      let secondGroups = Object.keys(firstDimension[firstGroups[0]][secondDimensionName]);

      if (dimensions[dimensions.length-1].label == "kjonn") {
        var colors = this.colorsToDict(secondGroups, ProfileColors.gender);
      } else {
        var colors = this.colorsToDict(secondGroups, ProfileColors.all);
      }

      secondGroups.forEach((second)=> {
        chartData[second] = []
        firstGroups.forEach((first)=> {
          chartData[second].push(firstDimension[first][secondDimensionName][second][this.props.unit][0])
        });
      });

      if (this.props.stacked) {
        this.chart.groups([secondGroups]);
      }

    }

    // if (this.props.unit == "prosent") {
    //   this.chart.axis.max(99);
    // }

    this.chart.load({
      json: chartData,
      type: "bar",
      categories: firstGroups,
      colors: colors
    });
  },
  render() {
    return <div/>
  }
});
