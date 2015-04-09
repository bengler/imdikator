require("babel/polyfill");

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
      name: k.name,
      regionCode: `K${k.code}`,
      code: k.code,
      type: 'kommune'
    }
  })
  .sort((k1, k2) => k1.name.localeCompare(k2.name));

const regions = kommunes;//.concat(fylkes);
const oslo = kommunes.find(k => k.regionCode == "K0301");

function changeRegion(e) {
  document.location.hash = e.target.value
}

function render() {

  const hashRegion = (document.location.hash.substring(1)).toLowerCase();

  if (hashRegion === 'd3bubble') {
    const D3Bubble = require("../components/charts/D3Bubble.jsx");
    return React.render(<D3Bubble/>, el);
  }

  const selectedRegion = regions.find(k => {
    return k.name.toLowerCase() == hashRegion ||
      k.regionCode.toLowerCase() == hashRegion ||
      k.code == hashRegion
  });
  if (!selectedRegion) {
    return React.render((
      <div>
        Fant ikke region {selectedRegion}. Du kan heller prøve en av disse:
        <ul>
          {regions.map(region => {
            return <li><a href={'#'+region.name}>{region.type}: {region.regionCode} / {region.name}</a></li>
          })}
        </ul>
      </div>
    ), el);
  }

  React.render((
    <div>
      <select style={{float: 'right'}} value={selectedRegion.name} onChange={changeRegion}>
        {regions.map(region => {
          return (
            <option value={region.name} style={{listStyleType: 'none'}}>
              {region.name} {region.type} {region.code}
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
