const React = require("react");
const rd3 = require('react-d3');



module.exports = React.createClass({
  displayName: 'Something',
  onClick() {

  },
  render() {
    console.info(this.props.data);
    return (
      <div>
        <h2>I am a stacked barchart</h2>
        <p>
          <div className="bullet--primary">This is a test</div>
        </p>
      </div>
    )
  }
});
