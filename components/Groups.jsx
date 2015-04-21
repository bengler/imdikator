const React = require("react");

const Group = require("./Group.jsx");

module.exports = React.createClass({
  displayName: 'Groups',
  render() {

    const groups = this.props.groupData.map( (group, i)=> {
      return <Group title={group.title} key={i} items={group.items} regions={this.props.regions} municipality={this.props.municipality}/>
    })

    return (
      <div className="imdikator-groups">
        {groups}
      </div>
    )
  }
});
