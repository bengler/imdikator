const React = require("react");
const c3 = require('c3');
const profileColors = require('../../lib/profileColors');

module.exports = React.createClass({

  displayName: 'AreaChart',

  componentDidMount() {
    this.chart = c3.generate({
      bindto: this.getDOMNode(),
      data: {
        x: 'x',
        json: []
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
              format: '%Y'
          }
        }
      }
    });
    this.renderChart();
  },

  componentDidUpdate() {
    this.renderChart();
  },

  renderChart() {
    const chartData = this.props.chartData;
    const colors = profileColors.colorsToDict(chartData[0].values, profileColors.all);

    let chartSpec = {
      json: chartData[0].data[this.props.unit],
      type: 'area',
      colors: colors
    }

    chartSpec.json.x = this.props.time;

    this.chart.load(chartSpec);

    if (this.props.stacked) {
      this.chart.groups([chartData[0].values]);
    }

  },

  render() {
    return <div/>
  }

});
