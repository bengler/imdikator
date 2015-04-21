const React = require("react");
const dotty = require("dotty");
const charts = require("./charts/");
const Reflux = require("reflux");
const DataStore = require("../stores/Data");
const ChartParamsStore = require("../stores/ChartParams");

const Loader = require("./Loader.jsx");
const DataActions = require("../actions/DataActions");
const Navigation = require("../actions/Navigation");
const Table = require("./Table.jsx");

function makeId() {
  return Math.random().toString(32).substring(2)
}

module.exports = React.createClass({
  displayName: 'ItemDataFetcher',

  mixins: [
    Reflux.listenTo(DataStore, "onDataChange"),
    Reflux.listenTo(ChartParamsStore, "onChartParamsChange")
  ],

  getInitialState() {
    return {loading: true};
  },

  onDataChange(data) {
    if (data.id !== this._id) {
      return;
    }
    this.setState({
      loading: data.state == 'loading',
      done: data.state == 'done',
      error: data.error,
      data: data.data
    });
  },

  onChartParamsChange(chartParams) {
    this.setState({
      chartParams: chartParams[this._id]
    });
  },

  mungeData(data) {
    // We aren't dealing with more than a single region yet
    const region = this.props.regions[0].regionCode;
    data = data.data[region];

    let dimensions = [].concat(this.props.item.dimensions);
    while(Object.keys(data[Object.keys(data)[0]]).length == 1) {
      data = dotty.search(data, "*.*")[0];
      dimensions = dimensions.slice(1,dimensions.length);
    }

    const units = Object.keys(this.getUnits(data, dimensions));

    return {
      data: data,
      units: units,
      dimensions: dimensions
    };
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
    this.fetchData();
  },

  fetchData() {
    this._id = makeId();
    DataActions.onFetchData(this._id, {
      item: this.props.item,
      regions: this.props.regions
    });
  },

  handleUnitSelected(e) {
    // Serializestate
    let state = { 
      unit: e.target.value,
      id: this._id };

    Navigation.updateNavigation(state)
  },

  componentWillReceiveProps(nextProps) {
    const currRegions = this.props.regions.map(r => r.regionCode);
    const nextRegions = nextProps.regions.map(r => r.regionCode);
    const changed = currRegions.length != nextRegions.length || currRegions.some((r, i)=> r !== nextRegions[i]);
    if (changed) {
      this.setState({data: null});
    }
  },

  render() {
    if (this.state.loading) {
      return (<Loader>Fetching data…</Loader>);
    }
    if (this.state.error) {
      return (<div><pre>Error: {this.state.error.stack}</pre></div>);
    }

    const Chart = charts[this.props.item.chartKind];
    const stacked = this.props.item.chartKind == "stackedBar" || this.props.item.chartKind == "stackedArea";
    const time = this.convertYearsToISO(this.state.data.time);
    const {data, units, dimensions} = this.mungeData(this.state.data);

    const unit = this.props.item.defaultUnit;

    console.info(units);

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

        {units.map((unit)=> {
          return (
            <button value={unit} onClick={this.handleUnitSelected}>
              {unit}
            </button>
          )
        })}

        <Chart dimensions={dimensions} stacked={stacked} unit={unit} time={time} data={data}/>
        <Table data={data}/>

      </div>
    )
  }
});
