const Reflux = require('reflux');
const qs = require('qs');
const NavActions = require("../actions/Navigation");

const Store = module.exports = Reflux.createStore({
  listenables: NavActions,
  onNavigate(path){

    //const params = qs.decode(path);

    //this.trigger(params);
  }
});