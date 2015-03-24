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
    const time = this.convertYearsToDate(data.time);

    let result = [];

    this.props.regions.forEach( (region)=> {
      // TODO:
      // - Handle more dimensions
      // - Handle different units than "personer"

      const firstDimension = data.data[region][this.props.item.dimensions[0]]

      Object.keys(firstDimension).forEach( (key, i)=> {
        let zippedYears = time.map( (e,i) => {
          return {
            x: e, 
            y: +(firstDimension[key].enhet.personer[i])
          };
        })

        result.push( {
          name: key,
          values: zippedYears
        });
      });

      console.info();
    })

    return result;
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

    const Chart = charts[this.props.item.chartKind];

  	return (
      <div>
        <Chart data={this.state.data}/>

        <pre>
          {JSON.stringify(this.state.data, null, 2)}
        </pre>
      </div>
    )
  }
});
