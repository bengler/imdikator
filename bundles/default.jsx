require("babel-core/polyfill");

const a11y = require('react-a11y');
const config = require("../config");

if (config.env === 'development') {
  a11y();
}

const {on, off} = require('dom-event');

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

function render() {
  const kommuneFromHash = document.location.hash.substring(1).toLowerCase();

  let region;
  if (kommuneFromHash) {
    region = kommunes.find(k => {
      return k.title.toLowerCase() == kommuneFromHash || k.regionCode.toLowerCase() == kommuneFromHash || k.code == kommuneFromHash
    });
  }
  React.render(<RegionalStats groupData={groupData} regions={[region || oslo]}/>, el);
}

on(window, 'hashchange', render);

render();