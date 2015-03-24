require("babel-core/polyfill");
require("./webfontconfig");

const {get} = require("../lib/request");
const a11y = require('react-a11y');
const config = require("../config");

if (config.env === 'development') {
  a11y();
}

const React = require("react");

const charts = require("../components/charts");
const Groups = require("../data/groups.json");
const RegionalStats = require("../components/RegionalStats");

const firstChart = Groups[1].items[0];

console.log(firstChart);

 function getStats() {
	return get('/api/query', {
	  table: "befolkning_hovedgruppe",
	  regions: ["K0102"],
	  dimensions: ["innvkat_5"],
	  time: ["1986", "1987"]
	})
    .then(res => res.json);
}

getStats().then( (data)=> {
	const ChartComponent = charts[firstChart.chartKind];
	const chartEl = document.createElement("div");
  React.render(<RegionalStats data={data}/>, chartEl);
  document.getElementById('imdikator').appendChild(chartEl);
})

// if (something) {
//   React.render(<Something/>, something);
// }
