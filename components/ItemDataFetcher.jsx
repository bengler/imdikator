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
    let result = [];

    // Ok, we aren't dealing with more than a single region
    const region = this.props.regions[0].regionCode;
    data = data.data[region];


    // TODO:
    // - Handle more dimensions
    // - Handle different units than "personer"
    const dimension = this.props.item.dimensions[0].label;
    const firstDimension = data[dimension];

    // Todo:
    // - Only valid when the skip is addressing the single first dimension. No pruning of leaves.
    if (this.props.item.skip) {
      this.props.item.skip.forEach((skip) => {
        delete firstDimension[skip.split(".")[1]];
      });
    }

    return data;
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



    const time = this.convertYearsToISO(this.state.data.time);
    const chartData = this.mungeData(this.state.data);

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
        <Chart item={this.props.item} time={time} data={chartData}/>
        <Table data={this.state.data}/>

      </div>
    )
  }
});
