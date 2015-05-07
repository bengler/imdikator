const React = require("react");

module.exports = React.createClass({
  displayName: 'Heading',
  render() {
    return (
      <h2>
        {this.props.title}
      </h2>
    )
  }
});




