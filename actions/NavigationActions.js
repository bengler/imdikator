const Reflux = require("reflux");
const url = require("url");
const qs = require("qs");
const {on, off} = require('dom-event');

function readPathFromHash() {
  return document.location.hash.substring(1) || '/';
}

const NavActions = module.exports = Reflux.createActions([
  "navigate",
  "setParamsForChart"
]);

NavActions.navigate.listen(path => {
  if (path !== readPathFromHash()) {
  	// TODO: Use pushstate instead of hash
    document.location.hash = path;
  }
});

NavActions.setParamsForChart.listen((chartId, params) => {
	const currentParsedUrl = url.parse(readPathFromHash(), true);
  const currentQuery = qs.parse(currentParsedUrl.search.substring(1));

  NavActions.navigate(url.format({
    pathname: currentParsedUrl.pathname,
    search: qs.stringify(Object.assign({}, currentQuery, {
      [chartId]: params
    }))
  }))
});

on(window, 'hashchange', (e)=> {
  // TODO: Add pushstate
  NavActions.navigate(readPathFromHash());
});
