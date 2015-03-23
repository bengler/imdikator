require("babel-core/polyfill");

require("./webfontconfig");

const React = require("react");

const Something = require("../components/Something.jsx");

const something = document.getElementById("something");
if (something) {
  React.render(<Something/>, something);
}