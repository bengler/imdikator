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
    const firstDimension = this.props.data[this.props.item.dimensions[0].label];
    const groups = Object.keys(firstDimension);

    let chartData = groups.reduce((series, g) => {
      series[g] = firstDimension[g].personer;
      return series;
    }, {})
    
    chartData.x = this.props.time;

    this.chart.load({
      json: chartData,
      type: 'area',
    });

    this.chart.groups([groups]);

  },
  render() {
    return <div/>
  }
});
