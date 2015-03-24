const React = require("react");

const Group = require("./Group.jsx");

module.exports = React.createClass({
  displayName: 'Groups',
  render() {
    return (
      <div>
        <Group />
        <Group />
        <Group />
        <Group />
      </div>
    )
  }
});
