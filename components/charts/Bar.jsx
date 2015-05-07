const React = require('react');
const c3 = require('c3');
const dotty = require('dotty');
const profileColors = require('../../lib/profileColors');

module.exports = React.createClass({
  displayName: 'AreaChart',

  componentDidMount() {
    this.chart = c3.generate({
      bindto: this.getDOMNode(),
      data: {
        json: []
      },
      bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
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

    let chartData = this.props.chartData;

    if (chartData[0].category == "kjonn") {
      var colors = profileColors.colorsToDict(chartData[0].values, profileColors.gender);
    } else {
      var colors = profileColors.colorsToDict(chartData[0].values, profileColors.all);
    }

    let chartSetup = {
      json: chartData[0].data[this.props.unit],
      type: "bar",
      colors: colors
    }

    if (chartData.length == 2) {
      chartSetup.categories = chartData[1].values;

      if (this.props.stacked !== undefined) {   
        this.chart.groups([chartData[0].values]);   
      }

    } else {
      chartSetup.categories = [""];
    }


    this.chart.load(chartSetup);

  },
  render() {
    return <div/>
  }
});
