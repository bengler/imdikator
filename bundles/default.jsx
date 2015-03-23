require("babel-core/polyfill");

require("./webfontconfig");

const React = require("react");

const Something = require("../components/Something.jsx");

React.render(<Something/>, document.getElementById("something"));