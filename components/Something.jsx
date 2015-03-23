const React = require("react");

module.exports = React.createClass({
  displayName: 'Something',
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        <p>
          <div className="bullet--primary">This is a test</div>
        </p>
      </div>
    )
  }
});