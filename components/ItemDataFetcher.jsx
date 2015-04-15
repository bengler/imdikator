const React = require("react");
const dotty = require("dotty");
const charts = require("./charts/");
const json = require("../lib/json");

const Loader = require("./Loader.jsx");
const Table = require("./Table.jsx");
const QueryDimension = require("@bengler/imdi-dataset").QueryDimension;

module.exports = React.createClass({
  displayName: 'ItemDataFetcher',

  getInitialState() {
    return {};
  },

  fetchData(item) {
    const query = {
      table: item.table,
      regions: this.props.regions.map(r => r.regionCode),
      dimensions: item.dimensions.map(QueryDimension.stringify),
      time: item.time
    };
    return json.get('/api/v1/query', query)
      .then(res => res.json)
      .catch(error => {
        console.log('Error', e)
      });
  },

  mungeData(data) {
    let result = [];

    // We aren't dealing with more than a single region yet
    const region = this.props.regions[0].regionCode;
    data = data.data[region];

    this.props.units = Object.keys(this.getUnits(data, this.props.item.dimensions));

    return data;
  },

  getUnits(data, dimensions) {
    dimensions.forEach((d)=> {
      data = this.skipDimension(data, d.label);
    })
    return data;
  },

  skipDimension(data, dimension) {
    data = data[dimension];
    const key = Object.keys(data)[0];
    return data[key];
  },

  convertYearsToDate(years) {
    return years.map((e) => {
      return new Date(e)
    });
  },

  convertYearsToISO(years) {
    return years.map((e) => {
      return e + "-01-01"
    });
  },

  componentDidMount() {
    this.fetchData(this.props.item).then((data)=> {
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
    const stacked = this.props.item.chartKind == "stackedBar" || this.props.item.chartKind == "stackedArea";
    const time = this.convertYearsToISO(this.state.data.time);
    const chartData = this.mungeData(this.state.data);

    const unit = this.props.item.defaultUnit;

    return (
      <div>
        {
        // <pre>
        //   {JSON.stringify(this.state.data, null, 2)}
        // </pre>
        // <pre>
        //   {JSON.stringify(chartData, null, 2)}
        // </pre>
        // <pre>
        //   {JSON.stringify(this.props.item, null, 2)}
        // </pre>
        }

        {this.props.item.title && <h4>{this.props.item.title}</h4>}

        <Chart item={this.props.item} stacked={stacked} unit={unit} time={time} data={chartData}/>
        <Table data={this.state.data}/>

      </div>
    )
  }
});
