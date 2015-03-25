const React = require("react");
const ItemDataFetcher = require("./ItemDataFetcher");

var Select = React.createClass({
  displayName: 'Select',
  render() {
    return(
      <div className={"select " + this.props.className}>
        <select className="">
          <option>2014</option>
          <option>2013</option>
          <option>2012</option>
          <option>2011</option>
          <option>2010</option>
          <option>2009</option>
        </select>
      </div>
    )
  }
});

module.exports = React.createClass({
  displayName: 'Group',
  render() {

    const items = this.props.items.map( (item)=> {
    	return <ItemDataFetcher item={item} regions={this.props.regions} />
    })

    // <pre>
    //  {JSON.stringify(this.props)}
    // </pre>

    return (
      <div className="imdikator-list__group">
        <Select className="right"/>
        <h3>
          {this.props.title} i {this.props.municipality.name}
        </h3>
      	{items}
      </div>
    )
  }
});
