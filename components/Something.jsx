const React = require("react");

module.exports = React.createClass({
  displayName: 'Something',
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        <p>
          Someting did render here.
        </p>
      </div>
    )
  }
});