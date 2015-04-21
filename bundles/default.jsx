require("babel/polyfill");

const config = require("../config");
const React = require("react");
const groupData = require("../data/groups.json");
const RegionalStats = require("../components/RegionalStats");
const NavActions = require("../actions/Navigation");
const LocationStore = require("../stores/Location");

if (config.env === 'development') {
  const a11y = require('react-a11y');
  a11y();
}

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
  NavActions.navigate('/'+e.target.value)
}

LocationStore.listen(render);

function render(path) {

  const pathRegion = path.replace(/^\//, '').toLowerCase();

  if (pathRegion === 'd3bubble') {
    const D3Bubble = require("../components/charts/D3Bubble.jsx");
    return React.render(<D3Bubble/>, el);
  }

  const selectedRegion = regions.find(k => {
    return k.name.toLowerCase() == pathRegion ||
      k.regionCode.toLowerCase() == pathRegion ||
      k.code == pathRegion
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
      <RegionalStats groupData={groupData} regions={[selectedRegion]}/>
    </div>
  ), el);
}

NavActions.navigate(document.location.hash.substring(1) || "/oslo");
