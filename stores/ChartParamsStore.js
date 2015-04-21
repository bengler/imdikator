const Reflux = require('reflux');
const UrlStore = require("./UrlStore");

module.exports = Reflux.createStore({
  init() {
    // Register UrlStore's changes
    this.listenTo(UrlStore, this.onNavigate);
  },
  getLast() {
    return this.last;
  },
  onNavigate({path, query}){
    this.last = query
    this.trigger(this.last)
  }
});