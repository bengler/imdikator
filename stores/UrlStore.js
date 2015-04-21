const Reflux = require('reflux');
const NavigationActions = require("../actions/NavigationActions");
const url = require('url');
const qs = require('qs');

module.exports = Reflux.createStore({
  listenables: NavigationActions,

  onNavigate(path){
    const parsed = url.parse(path, true);
    this.trigger({
      path: parsed.pathname,
      query: qs.parse(parsed.search.substring(1))
    });

  }
});