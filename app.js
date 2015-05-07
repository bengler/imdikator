require("babel/register");
var express = require('express');
var path = require('path');
var config = require("./config");
var helmet = require('helmet');

var app = express();
app.disable('x-powered-by');

app.use(helmet.nosniff());
app.use(helmet.xframe('sameorigin'));
app.use(helmet.xssFilter());
app.use(helmet.ienoopen());

app.set('query parser', 'extended');

if (config.env === 'development') {
  app.use(require("quickreload")({server: app}));
}

if (config.env === 'development') {
  var serve = require("staticr/serve");
  app.use(serve(require("./static-routes/browserify-bundles")));
  app.use(serve(require("./static-routes/stylesheets")));
}

if (config.env === 'development') {
  var capture = require("error-capture-middleware");
  app.use(capture.js());
  app.use(capture.css());
}

var React = require('react');
var Layout = require('./components/Layout.jsx');
var rendered = React.renderToStaticMarkup(React.createElement(Layout));
app.get("/", function(req, res) {
  res.status(200).send(rendered);
});

app.use("/api/v1", require("./api"));

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;