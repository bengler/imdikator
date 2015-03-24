const React = require("react");

module.exports = React.createClass({
  displayName: 'Something',
  onClick() {

  },
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        <p>
          <div onClick={this.onClick}>Clickme</div>
          <div className="bullet--primary">This is a test</div>
        </p>
      </div>
    )
  }
});