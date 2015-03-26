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
  }).sort((k1, k2) => k1.title.localeCompare(k2.title));
const fylkes = require("../data/fylker.json")
  .map(fylke => {
    return {
      title: fylke.tittel,
      regionCode: 'F' + fylke.kode,
      code: fylke.kode,
      type: 'fylke'
    }
  });

const regions = kommunes;//.concat(fylkes);
const oslo = kommunes.find(k => k.regionCode == "K0301");

function changeRegion(e) {
  document.location.hash = e.target.value
}

function render() {
  const hashRegion = (document.location.hash.substring(1)).toLowerCase();

  const selectedRegion = regions.find(k => {
    return k.title.toLowerCase() == hashRegion ||
      k.regionCode.toLowerCase() == hashRegion ||
      k.code == hashRegion
  });
  if (!selectedRegion) {
    return React.render((
      <div>
        Fant ikke region {selectedRegion}. Du kan heller prøve en av disse:
        <ul>
          {regions.map(region => {
            return <li><a href={'#'+region.title}>{region.type}: {region.regionCode} / {region.title}</a></li>
          })}
        </ul>
      </div>
    ), el);
  }

  React.render((
    <div>
      <select style={{float: 'right'}} value={selectedRegion.title} onChange={changeRegion}>
        {regions.map(region => {
          return (
            <option value={region.title} style={{listStyleType: 'none'}}>
              {region.title} {region.type} {region.code}
            </option>
          )
        })}
      </select>
      <RegionalStats groupData={groupData} regions={[selectedRegion || oslo]}/>
    </div>
  ), el);
}

on(window, 'hashchange', (e)=> {
  if (document.location.hash.trim() !== '') {
    render();
  }
});

if (!document.location.hash.substring(1)) {
  document.location.hash = "oslo"
}
else {
  render();
}
