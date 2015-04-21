const Reflux = require('reflux');
const NavActions = require("../actions/Navigation");

const Store = module.exports = Reflux.createStore({
  listenables: NavActions,
  onNavigate(path){
    this.trigger(path);
  }
});