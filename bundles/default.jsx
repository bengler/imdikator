require("babel-core/polyfill");
require("./webfontconfig");

const a11y = require('react-a11y');
const config = require("../config");

if (config.env === 'development') {
  a11y();
}

const React = require("react");

const Something = require("../components/Something.jsx");

const something = document.getElementById("something");
if (something) {
  React.render(<Something/>, something);
}

const {get} = require("../lib/request");

get('/api/query', {
  table: "befolkning_hovedgruppe",
  regions: ["K0102"],
  dimensions: ["innvkat_5"],
  time: ["1986", "1987"]
}).then(res => console.log(res.json));