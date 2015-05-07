const React = require("react");

const Group = require("./Group.jsx");
const Heading = require("./Heading.jsx");

module.exports = React.createClass({
  displayName: 'Groups',
  render() {

    const groups = this.props.groupData.map( (group, i)=> {
      if (group.groupKind == "heading") {
        return <Heading id={i} title={group.title} key={i} />
      } else {
        return <Group id={i} title={group.title} key={i} items={group.items} regions={this.props.regions} municipality={this.props.municipality}/>
      }
    })

    return (
      <div className="imdikator-groups">
        {groups}
      </div>
    )
  }
});
