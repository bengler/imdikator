const React = require("react");
const charts = require("./charts/");
const {get} = require("../lib/request");

const Loader = require("./Loader.jsx");
const Table = require("./Table.jsx");

module.exports = React.createClass({
  displayName: 'ItemDataFetcher',

  getInitialState() {
  	return {};
  },

  fetchData(item) {
    const query = {
      table: item.table,
      regions: this.props.regions.map(r => r.regionCode),
      dimensions: item.dimensions,
      time: item.time
    };
    return get('/api/query', query).then(res => res.json);
  },

  mungeData(data) {
    const time = this.convertYearsToDate(data.time);

    let result = [];

    // Ok, we aren't dealing with more than a single region
    this.props.regions.forEach( (region)=> {
      // TODO:
      // - Handle more dimensions
      // - Handle different units than "personer"

      const dimension = this.props.item.dimensions[0];

      const firstDimension = data.data[region.regionCode][dimension];

      // HACK:
      // - Only valid when the skip is addressing the single first dimension. No pruning of leaves.
      if (this.props.item.skip) {
        this.props.item.skip.forEach( (skip) => {
          delete firstDimension[skip.split(".")[1]];        
        });
      }

      Object.keys(firstDimension).forEach( (key, i)=> {
        if (time.length == 1) {
          result.push( {
            label: key,
            value: +(firstDimension[key].personer[0])
          });
        } else {
          var values = time.map( (e,i) => {
            return {
              x: e, 
              y: +(firstDimension[key].personer[i])
            };
          })
          result.push( {
            name: key,
            values: values
          });
        }

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
  componentWillReceiveProps(nextProps) {
    const currRegions = this.props.regions.map(r => r.regionCode);
    const nextRegions = nextProps.regions.map(r => r.regionCode);
    const changed = currRegions.length != nextRegions.length || currRegions.some((r, i)=> r !== nextRegions[i]);
    if (changed) {
      this.setState({data: null});
    }
  },
  componentDidUpdate() {
    if (!this.state.data) {
      this.fetchData(this.props.item).then(data => {
        this.setState({data: data});
      })
    }
  },

  render() {
  	if (!this.state.data) {
  		return (<Loader>Fetching data…</Loader>);
  	}

    const Chart = charts[this.props.item.chartKind];

  	return (
      <div>
        <Chart data={this.mungeData(this.state.data)}/>

        <pre>
          {JSON.stringify(this.props.item, null, 2)}
        </pre>
        <pre>
          {JSON.stringify(this.state.data, null, 2)}
        </pre>
        <pre>
          {JSON.stringify(this.mungeData(this.state.data, null, 2))}
        </pre>

        <Table data={this.state.data}/>

      </div>
    )
  }
});
