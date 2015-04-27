const React = require('react');
const c3 = require('c3');
const dotty = require('dotty');
const profileColors = require('../../lib/profileColors');

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

    let dimensions = this.props.dimensions;
    let data = this.props.data;

    if (this.props.debug) console.info("Before transform in bar:", data);
    if (this.props.debug) console.info("And with dimensions:", dimensions);


    let chartData = {};
    let firstGroups = [];

    let firstDimension = data[dimensions[0].label];
    firstGroups = Object.keys(firstDimension);

    var colorGroups = firstGroups;

    if (dimensions.length == 2) {
      var secondDimensionName = dimensions[1].label;
      // Assumes nested groups follow same schema. Probes the first key.
      var secondGroups = Object.keys(firstDimension[firstGroups[0]][secondDimensionName]);
      colorGroups = secondGroups;
    }

    if (dimensions[dimensions.length-1].label == "kjonn") {
      var colors = profileColors.colorsToDict(colorGroups, profileColors.gender);
    } else {
      var colors = profileColors.colorsToDict(colorGroups, profileColors.all);
    }

    if (secondGroups) {
      secondGroups.forEach((second)=> {
        chartData[second] = []
        firstGroups.forEach((first)=> {
          chartData[second].push(firstDimension[first][secondDimensionName][second][this.props.unit][0])
        });
      });

      if (this.props.stacked) {
        this.chart.groups([secondGroups]);
      }

    } else {
      firstGroups.forEach((first)=> {
        console.info(first, firstDimension[first]);
        chartData[first] = [firstDimension[first][this.props.unit][0]];
      });
    }

    // if (this.props.unit == "prosent") {
    //   this.chart.axis.max(99);
    // }

    if (this.props.debug) console.info("Chartdata:", chartData);
    if (this.props.debug) console.info("Firstgroups:", firstGroups);



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
