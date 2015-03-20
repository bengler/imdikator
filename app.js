require("babel-core/register")({
  experimental: true
});

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
  var quickreload = require("quickreload");
  app.use(quickreload());
}

if (config.env === 'development') {
  var serve = require("staticr/serve");
  app.use(serve(require("./static-routes/browserify-bundles")));
  app.use(serve(require("./static-routes/stylesheets")));
}

if (config.env === 'development') {
  var capture = require("error-capture-middleware");
  app.use("/browser", capture.js());
  app.use("/stylesheets", capture.css());
}

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;