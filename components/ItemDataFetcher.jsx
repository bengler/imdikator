const React = require("react");
const charts = require("./charts/");
const {get} = require("../lib/request");

const Loader = require("./Loader.jsx");

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
		})
    .then(res => res.json);
  },

  mungeData(data) {
    const time = this.convertYearsToDate(data.time);

    let result = [];

    this.props.regions.forEach( (region)=> {
      // TODO:
      // - Handle more dimensions
      // - Handle different units than "personer"

      const dimension = this.props.item.dimensions[0];

      const firstDimension = data.data[region][dimension];

      // - Only valid when the skip is addressing the single dimension
      this.props.item.skip.forEach( (skip) => {
        delete firstDimension[skip.split(".")[1]];        
      });

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
  		return (<Loader>Fetching data…</Loader>);
  	}

    const Chart = charts[this.props.item.chartKind];

    // <pre>
    //   {JSON.stringify(this.state.data, null, 2)}
    // </pre>

  	return (
      <div>
        <Chart data={this.mungeData(this.state.data)}/>
      </div>
    )
  }
});
