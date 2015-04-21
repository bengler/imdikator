const Reflux = require("reflux");
const {on, off} = require('dom-event');

function readPathFromHash() {
  return document.location.hash.substring(1) || '/';
}

const NavActions = module.exports = Reflux.createActions([
  "navigate"
]);

NavActions.navigate.listen(path => {
  if (path !== readPathFromHash()) {
    document.location.hash = path
  }
});

on(window, 'hashchange', (e)=> {
  NavActions.navigate(readPathFromHash());
});