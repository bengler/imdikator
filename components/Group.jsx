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
    const {regions} = this.props;

    const items = this.props.items.map( (item, i)=> {
    	return <ItemDataFetcher key={i} item={item} regions={regions} />
    });

    // <pre>
    //  {JSON.stringify(this.props)}
    // </pre>

    // Todo: handle multiple regions
    const region = regions[0];

    return (
      <div className="imdikator-list__group">
        <Select className="right"/>
        <h3>
          {this.props.title} i {region.name}
        </h3>
      	{items}

        <div className="imdikator-list__functions">
          <a href="javascript://">Last ned bilde</a>
          <a href="javascript://">Last ned Excel-fil (csv)</a>
          <a href="javascript://">Del denne statistikken</a>
          <a href="javascript://">Om tallene</a>
        </div>

      </div>
    )
  }
});
