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
    const groups = this.props.data.map(d => d[0]);
    this.chart.load({
      columns: this.props.data,
      types: groups.reduce((types, g) => {
        types[g] = 'area'
        // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
        return types;
      }, {}),
      groups: [groups]
    })
  },
  render() {
    return <div/>
  }
});
