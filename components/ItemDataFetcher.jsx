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
		  regions: this.props.regions,
		  dimensions: item.dimensions,
		  time: item.time
		}).then((res) => {
      console.info(res); 
      return this.mungeData(res.json);
    })
  },

  mungeData(data) {
    data.time = this.convertYearsToDate(data.time);
    

    return data
  },

  convertYearsToDate(years) {
    return years.map( (e) => {
      return new Date(e)
    });
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
  	return (
      <div>
        {JSON.stringify(this.state.data)}
      </div>
    )
  }
});
