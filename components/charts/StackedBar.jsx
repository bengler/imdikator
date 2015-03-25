const React = require("react");
const rd3 = require('react-d3');
const BarChart = rd3.BarChart;


module.exports = React.createClass({
  displayName: 'Something',
  onClick() {

  },
  render() {
    console.info(this.props.data);
    return (
      <div>
        <BarChart
          margins={{top: 10, right: 20, bottom: 40, left: 80}}
          legend={true}
          data={this.props.data}
          width={800}
          height={300}
        />
      </div>
    )
  }
});
