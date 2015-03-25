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
      <a href="#">innvandrere</a>
    )
  }
});

module.exports = React.createClass({
  displayName: 'RegionalStats',
  render() {
    return (
      <div className="imdikator-list__wrapper">
        <h1 className="center">{municipality.name}</h1>
        <p className="imdikator-preamble">
          {municipality.name} har tatt imot {municipality.refugees_qty_pr_thousand} <RefugeesLink/> pr. 1000 innbyggere <br/>
          {municipality.refugees_percent}% av innvandrerne i kommunen er flyktninger.<br/>
          Kommunen oppfyller ikke kravene til <a href="#">norskundervisning</a>.<br/>
        </p>
        <div className="center">
          <a className="button">Lag faktaark for {municipality.name}</a>
        </div>
        <Groups groupData={this.props.groupData} regions={this.props.regions} municipality={municipality} />
      </div>
    )
  }
});