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
const fylkes = require("../data/fylker.json")
  .map(fylke => {
    return {
      title: fylke.tittel,
      regionCode: 'F' + fylke.kode,
      code: fylke.kode,
      type: 'fylke'
    }
  });

const regions = kommunes.concat(fylkes);
const oslo = kommunes.find(k => k.regionCode == "K0301");

function render() {
  const selectedRegion = (document.location.hash.substring(1) || 'K0301').toLowerCase();

  const region = regions.find(k => {
    return k.title.toLowerCase() == selectedRegion ||
      k.regionCode.toLowerCase() == selectedRegion ||
      k.code == selectedRegion
  });
  if (!region) {
    return React.render((
      <div>
        Fant ikke region {selectedRegion}. Du kan heller prøve en av disse:
        <ul>
          {regions.map(region => {
            return <li>{region.type}: {region.regionCode} / {region.title}</li>
          })}
        </ul>
      </div>
    ), el);
  }
  React.render(<RegionalStats groupData={groupData} regions={[region || oslo]}/>, el);
}

on(window, 'hashchange', render);

render();