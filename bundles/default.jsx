require("babel/polyfill");

const config = require("../config");
const React = require("react");
const groupData = require("../data/groups.json");
const RegionalStats = require("../components/RegionalStats");
const StatNavigation = require("../components/StatNavigation");
const Groups = require("../components/Groups.jsx");

const NavActions = require("../actions/NavigationActions");
const UrlStore = require("../stores/UrlStore");

if (config.env === 'development') {
  const a11y = require('react-a11y');
  a11y();
}

const el = document.getElementById('imdikator');

const municipalities = require("../data/kommuner.json")
  .map(k => {
    return {
      name: k.name,
      regionCode: `K${k.code}`,
      code: k.code,
      type: 'kommune'
    }
  })
  .sort((k1, k2) => k1.name.localeCompare(k2.name));

const regions = municipalities;//.concat(fylkes);
const oslo = municipalities.find(k => k.regionCode == "K0301");

function changeRegion(e) {
  NavActions.navigate('/'+e.target.value)
}

var MunicipalPulldown = React.createClass({
  displayName: 'MunicipalPulldown',
  render() {
    return (
      <select style={{float: 'right'}} value={this.props.selectedRegion.name} onChange={changeRegion}>
        {regions.map(region => {
          return (
            <option value={region.name}>
              {region.name} {region.type} {region.code}
            </option>
          )
        })}
      </select>
    )
  }
});


UrlStore.listen(function render(url) {

  console.log('render top level, ', url)

  const urlPath = url.path.replace(/^\//, '').toLowerCase().split("/");

  const pathRegion = urlPath[0];
  const pathStatgroup = urlPath[1];

  const selectedRegion = regions.find(k => {
    return k.name.toLowerCase() == pathRegion ||
      k.regionCode.toLowerCase() == pathRegion ||
      k.code == pathRegion
  });

  var statGroup = undefined

  if (pathStatgroup !== undefined) {
    var statGroup = groupData.find( gd => {
      return gd.urlName == pathStatgroup.toLowerCase()
    });
  }


  if (statGroup === undefined) {
    var content = <RegionalStats groupData={groupData} regions={[selectedRegion]}/>;
  } else {
    var content = <Groups statGroup={statGroup} regions={[selectedRegion]}/>
  }

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
      <StatNavigation groupData={groupData} statGroup={pathStatgroup}/>

      {content}

      <MunicipalPulldown selectedRegion={selectedRegion} />
    </div>

  ), el);
});


NavActions.navigate(document.location.hash.substring(1) || "/oslo");
