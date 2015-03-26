const React = require("react");

const Groups = require("./Groups.jsx");

var municipality = {
  name: "Oslo kommune",
  refugees_qty_pr_thousand: 4,
  refugees_percent: 15
}

var RefugeesLink = React.createClass({
  displayName: 'RegionalStats',
  render() {
    return (
      <a href="javascript://">innvandrere</a>
    )
  }
});

module.exports = React.createClass({
  displayName: 'RegionalStats',
  propTypes: {
    regions: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      regionCode: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired
    })).isRequired
  },
  render() {
    const {regions} = this.props;
    // Todo: only show the first region we got for now. We need to figure out how to combine several areas into one
    const region = regions[0];
    return (
      <div className="imdikator-list__wrapper">
        {regions.length > 1 && <p>Hei, du har inkludert flere regioner. Dette virker ikke ennå.</p>}
        <h1 className="center">{region.title}</h1>
        <p className="imdikator-preamble">
          {region.title} har tatt imot {municipality.refugees_qty_pr_thousand} <RefugeesLink/> pr. 1000 innbyggere <br/>
          {municipality.refugees_percent}% av innvandrerne i kommunen er flyktninger.<br/>
          Kommunen oppfyller ikke kravene til <a href="#">norskundervisning</a>.<br/>
        </p>
        <div className="center">
          <a className="button" role="button">Lag faktaark for {region.title}</a>
        </div>
        <Groups groupData={this.props.groupData} regions={regions}/>
      </div>
    )
  }
});