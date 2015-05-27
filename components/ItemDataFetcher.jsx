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
const cx = classNames;

const treeTools = require("../lib/treeTools");

function getSemiRandomString() {
  return Math.random().toString(32).substring(2)+Math.random().toString(32).substring(2)
}

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
    if (!this.__id) {
      this.__id = getSemiRandomString();
    }
    return this.__id;
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
    data = treeTools.relabelTree(data);
    data = treeTools.pruneSingularCategories(data);
    const units = treeTools.findUnits(data);
    const chartData = treeTools.extractChartData(data);

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

    const chartKind = this.props.item.chartKind;
    const Chart = charts[chartKind];
    const stacked = chartKind == "stackedBar" || chartKind == "stackedArea";
    const time = this.convertYearsToISO(this.state.data.time);
    const {data, chartData, units} = this.mungeData(this.state.data);

    const selectedUnit = this.state.selectedUnit || this.props.item.defaultUnit;

    //console.log("Chart kind: %s", chartKind)

    return (
      <div className="imdikator-graph">
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

        {units.length > 1 && units.map(unit => {
          const classes = cx({
            "imdikator-graph__button": true,
            "imdikator-graph__button--unit": true,
            "imdikator-graph__button--selected": selectedUnit == unit,

          })
          return (
            <button type="button" className={classes} onClick={()=> this.handleUnitSelected(unit)}>
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
