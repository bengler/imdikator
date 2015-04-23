const Reflux = require("reflux");
const Qs = require("qs");
const url = require("url");
const {on, off} = require('dom-event');

function readPathFromHash() {
  return document.location.hash.substring(1) || '/';
}

const NavActions = module.exports = Reflux.createActions([
  "navigate", "updateNavigation"
]);

NavActions.navigate.listen(path => {
  if (path !== readPathFromHash()) {
  	// TODO: Add pushstate
    document.location.hash = path;
  }
});

NavActions.updateNavigation.listen((state) => {
	const currentParsedUrl = url.parse(readPathFromHash(), true);
	console.log(currentParsedUrl);

	// document.location.hash = Qs.stringify(state);
})

on(window, 'hashchange', (e)=> {
  // TODO: Add pushstate
  NavActions.navigate(readPathFromHash());
});
