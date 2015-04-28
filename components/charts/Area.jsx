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
    const firstDimension = this.props.data[this.props.dimensions[0].label];
    const groups = Object.keys(firstDimension);

    let chartData = groups.reduce((series, g) => {
      series[g] = firstDimension[g][this.props.unit];
      return series;
    }, {})

    chartData.x = this.props.time;
    const colors = profileColors.colorsToDict(groups, profileColors.all);

    this.chart.load({
      json: chartData,
      type: 'area',
      colors: colors
    });

    if (this.props.stacked) {
      this.chart.groups([groups]);
    }

  },
  render() {
    return <div/>
  }
});
