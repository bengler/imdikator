const React = require("react");

const Group = require("./Group.jsx");

module.exports = React.createClass({
  displayName: 'Groups',
  render() {

    const groups = this.props.groupData.map( (group)=> {
      return <Group title={group.title} items={group.items} regions={this.props.regions} />
    })

    return (
      <div>
        {groups}
      </div>
    )
  }
});
