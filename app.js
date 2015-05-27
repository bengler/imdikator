const express = require('express');
const path = require('path');
const config = require("./config");
const helmet = require('helmet');

const app = express();
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
  const serve = require("staticr/serve");
  app.use(serve(require("./static-routes")));
}

if (config.env === 'development') {
  const capture = require("error-capture-middleware");
  app.use(capture.js());
  app.use(capture.css());
}

const React = require('react');
const Layout = require('./components/Layout.jsx');
const rendered = React.renderToStaticMarkup(React.createElement(Layout));
app.get("/", function(req, res) {
  res.status(200).send(rendered);
});

app.use("/api/v1", require("./api"));

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
