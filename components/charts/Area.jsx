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
        columns: []
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

    const chartData = groups.map ((group)=> {
      return [group].concat(firstDimension[group].personer)
    })

    console.info(chartData);

    this.chart.load({
      columns: chartData,
      types: groups.reduce((types, g) => {
        types[g] = 'area'
        // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
        return types;
      }, {
        axis : {
          time : {
              type : 'timeseries',
              tick: {
                  format: function (x) { return x.getFullYear(); }
                //format: '%Y' // format string is also available for timeseries data
              }
          }
        }
      }),
      groups: [groups]
    })
  },
  render() {
    return <div/>
  }
});
