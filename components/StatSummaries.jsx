const React = require("react");

const StatSummary = require("./StatSummary.jsx");
const Heading = require("./Heading.jsx");

module.exports = React.createClass({
  displayName: 'StatSummaries',
  render() {

    const statSummaries = this.props.groupData.map( (group, i)=> {
      return <StatSummary id={i} regions={this.props.regions} urlName={group.urlName} title={group.title} key={i} />
    })

    return (
      <ul className="col-12 stat-summaries">
        {statSummaries}
      </ul>
    )
  }
});
