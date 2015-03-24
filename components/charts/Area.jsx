const React = require("react");
const rd3 = require('react-d3');
const AreaChart = rd3.AreaChart;
const LineChart = rd3.LineChart;
const ScatterChart = rd3.ScatterChart;

module.exports = React.createClass({
  displayName: 'AreaChart',
  onClick() {

  },
  render() {

    const data = [
      {
        name: "foo",
        values: [{x: 10, y:20}, {x: 20, y:30}]
      },
      {
        name: "bar",
        values: [{x: 10, y:-20}, {x: 20, y:15}]
      }
    ] 


    return (
      <div>
        <AreaChart
          margins={{top: 10, right: 20, bottom: 40, left: 145}}
          legend={true}
          data={this.props.data}
          width={800}
          height={300}
          xAxisTickInterval={{unit: 'year', interval: 5}}
          title="Area Chart"
        />
      </div>
    )
  }
});
