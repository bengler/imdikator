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
        json: {}
      }
    });
    this.renderChart();
  },
  componentDidUpdate() {
    this.renderChart();
  },
  renderChart() {

    const firstDimension = this.props.data[this.props.item.dimensions[0]];
    const groups = Object.keys(firstDimension);

    const chartData = groups.reduce((series, g) => {
      series[g] = firstDimension[g].personer;
      return series;
    }, {})

    chartData.x = this.props.time;

    console.log(this.props.data);
    console.log(chartData)

    this.chart.load({
      json: chartData,
      axis: {
        x: {
          type: 'timeseries',
          tick: {
              format: '%Y-%m-%d'
          }
        }
      },
      types: groups.reduce((types, g) => {
        types[g] = 'area'
        // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
        return types;
      }, {}),
      groups: [groups]
    });

  },
  render() {
    return <div/>
  }
});
