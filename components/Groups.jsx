const React = require("react");

const Chart = require("./Chart.jsx");
const Heading = require("./Heading.jsx");

module.exports = React.createClass({
  displayName: 'Groups',
  render() {
    const charts = this.props.statGroup.items.map( (item, i)=> {
      return <Chart id={i} urlName={this.props.statGroup.urlName} title={item.title} key={i} item={item} regions={this.props.regions} municipality={this.props.municipality}/>
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
