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