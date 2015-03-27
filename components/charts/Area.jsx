const React = require("react");
const c3 = require('c3');

module.exports = React.createClass({
  displayName: 'AreaChart',
  onClick() {

  },
  componentDidMount() {
    const groups = this.props.data.map(d => d[0]);
    this.renderChart();
    this.chart = c3.generate({
      bindto: this.getDOMNode(),
      data: {
        columns: this.props.data,
        types: groups.reduce((types, g) => {
          types[g] = 'area'
          // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
          return types;
        }, {}),
        groups: [groups]
      }
    });
  },
  componentDidUpdate() {
    this.renderChart();
  },
  renderChart() {

  },
  render() {
    console.log(this.props.data)
    return <div/>
  }
});
