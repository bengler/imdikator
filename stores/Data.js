const Reflux = require('reflux');
const DataActions = require("../actions/DataActions");
const json = require("../lib/json");
const QueryDimension = require("@bengler/imdi-dataset").QueryDimension;

function doQuery(query) {
  return json.get('/api/v1/query', query)
    .then(res => res.json)
}


module.exports = Reflux.createStore({
  listenables: [DataActions],

  onFetchData(id, {item, regions}) {

    var query = {
      table: item.table,
      regions: regions.map(r => r.regionCode),
      dimensions: item.dimensions.map(QueryDimension.stringify),
      time: item.time
    };

    this.trigger({id: id, state: 'loading'});

    doQuery(query)
      .then(json => {
        this.trigger({
          id: id,
          state: 'done',
          data: json
        })
      })
      .catch(error => {
        this.trigger({
          id: id,
          state: 'error',
          error: error
        })
      })
  }
});