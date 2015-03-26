require("babel-core/polyfill");

const a11y = require('react-a11y');
const config = require("../config");

if (config.env === 'development') {
  a11y();
}

const React = require("react");

const groupData = require("../data/groups.json");
const RegionalStats = require("../components/RegionalStats");

var el = document.getElementById('imdikator');

const kommunes = require("../data/kommuner.json")
  .map(k => {
    return {
      title: k.tittel,
      regionCode: 'K' + k.kode,
      code: k.kode,
      type: 'kommune'
    }
  });

const oslo = kommunes.find(k => k.regionCode == "K0301");

React.render(<RegionalStats groupData={groupData} regions={[oslo]}/>, el);

