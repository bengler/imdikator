const React = require("react");
const rd3 = require('react-d3');
const AreaChart = rd3.AreaChart;

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
        values: [{x: 10, y:10}, {x: 20, y:15}]
      }
    ] 


    return (
      <div>
        <AreaChart
          data={data}
          width={800}
          height={300}
          xAxisTickInterval={{unit: 'year', interval: 5}}
          title="Area Chart"
        />
      </div>
    )
  }
});
