const React = require("react");

const Groups = require("./Groups.jsx");

module.exports = React.createClass({
  displayName: 'RegionalStats',
  render() {
    return (
      <div>
        <Groups/>
      </div>
    )
  }
});
