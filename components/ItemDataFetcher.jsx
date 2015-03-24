const React = require("react");
const charts = require("./charts/");
const {get} = require("../lib/request");

module.exports = React.createClass({
  displayName: 'ItemDataFetch',

  getInitialState() {
  	return {};
  },

  fetchData(item) {
		return get('/api/query', {
		  table: item.table,
		  regions: ["K0102"],
		  dimensions: item.dimensions,
		  time: item.time
		}).then(res => res.json);
  },

  componentDidMount() {
  	this.fetchData(this.props.item).then( (data)=> {
  		this.setState({data: data});
  	});
  },

  render() {
  	if (!this.state.data) {
  		return (<div> Fetching data </div>);
  	}
  	console.log(this.state.data);
  	return <div/>
  }
});
