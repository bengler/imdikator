const React = require("react");
const dotty = require("dotty");
const charts = require("./charts/");
const Reflux = require("reflux");
const DataStore = require("../stores/ChartDataStore");
const classNames = require("classnames");
const ChartParamsStore = require("../stores/ChartParamsStore");

const Loader = require("./Loader.jsx");
const DataActions = require("../actions/DataActions");
const Navigation = require("../actions/NavigationActions");
const Table = require("./Table.jsx");
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const treeTools = require("../lib/treeTools");

module.exports = React.createClass({
  displayName: 'ItemDataFetcher',

  mixins: [
    PureRenderMixin,
    Reflux.listenTo(DataStore, "onDataChange"),
    Reflux.listenTo(ChartParamsStore, "onChartParamsChange")
  ],

  getInitialState() {
    // Todo: fix sync issue w params store
    const chartParams = ChartParamsStore.getLast();
    return {
      loading: true,
      selectedUnit: chartParams && chartParams[this.getId()] && chartParams[this.getId()].unit
    };
  },

  getId() {
    return this.props.id
  },

  onDataChange(data) {
    if (data.id !== this.getId()) {
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
    if (chartParams[this.getId()]) {
      this.setState({
        selectedUnit: chartParams[this.getId()].unit
      });
    }
  },

  mungeData(data) {

    // Chop. We aren't dealing with more than a single region yet
    const region = this.props.regions[0].regionCode;
    data = data.data[region];

    if (this.props.item.debug) console.info("Data we got (sans regions):", data);
    data = treeTools.pruneSingularCategories(data);
    const depths = treeTools.probeDepths(data);

    const chartData = treeTools.extractChartData(data);

    if (this.props.item.debug) console.info("After prune:", data);
    if (this.props.item.debug) console.info("… and as chart data:", chartData);

    const units = treeTools.findUnits(data);

    if (this.props.item.debug) console.info("With depths:", depths);
    if (this.props.item.debug) console.info("… with units:", units);

    return {
      data: data,
      chartData: chartData,
      units: units
    };
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
    DataActions.fetchData(this.getId(), {
      item: this.props.item,
      regions: this.props.regions
    });
  },

  handleUnitSelected(unit) {
    Navigation.setParamsForChart(this.getId(), {unit: unit})
  },

  render() {
    if (this.state.loading) {
      return (<Loader>Henter data…</Loader>);
    }
    if (this.state.error) {
      return (<div><pre>Error: {this.state.error.stack}</pre></div>);
    }

    const Chart = charts[this.props.item.chartKind];
    const stacked = this.props.item.chartKind == "stackedBar" || this.props.item.chartKind == "stackedArea";
    const time = this.convertYearsToISO(this.state.data.time);
    const {data, chartData, units} = this.mungeData(this.state.data);

    const selectedUnit = this.state.selectedUnit || this.props.item.defaultUnit;

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

        {units.length > 1 && units.map(unit => {
          return (
            <button type="button" className={classNames({selected: selectedUnit == unit })} onClick={()=> this.handleUnitSelected(unit)}>
              {unit}
            </button>
          )
        })}

        <Chart chartData={chartData} stacked={stacked} unit={selectedUnit} time={time} debug={this.props.item.debug} data={data}/>
        <Table data={data}/>

      </div>
    )
  }
});
