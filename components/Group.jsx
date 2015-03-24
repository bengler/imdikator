const React = require("react");
const ItemDataFetcher = require("./ItemDataFetcher");

module.exports = React.createClass({
  displayName: 'Group',
  render() {

    const items = this.props.items.map( (item)=> {
    	return <ItemDataFetcher item={item} />
    })

    return (
      <div className="imdikator-group">
      	{JSON.stringify(this.props)}
        <h1>{this.props.title}</h1>
      	{items}
      </div>
    )
  }
});
