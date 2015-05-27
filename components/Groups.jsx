const React = require("react");

const Chart = require("./Chart.jsx");
const Heading = require("./Heading.jsx");

module.exports = React.createClass({
  displayName: 'Groups',
  render() {
    const charts = this.props.statGroup.items.map( (item,i)=> {
      const key = [
        item.chartKind,
        item.table,
        item.dimensions.map(dim => dim.label + [].concat(dim.include).concat(dim.exclude).join(".")).join("-"),
        item.time]
        .join('/');
      return (
        <Chart
          urlName={this.props.statGroup.urlName}
          title={item.title}
          order={i}
          key={key}
          item={item}
          regions={this.props.regions}
          municipality={this.props.municipality}
        />
      )
    })
    return (
      <div className="wrapper imdikator-groups">
        <div className="grid">
          {charts}
        </div>
      </div>
    )
  }
});
