const React = require("react");
const StatSummaries = require("./StatSummaries.jsx");
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;

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
  mixins: [PureRenderMixin],
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
      <div>
        <div className="wrapper">
          {regions.length > 1 && <p>Hei, du har inkludert flere regioner. Dette virker ikke ennå.</p>}
          <h1>{region.name}</h1>
          <div className="">
            <a className="button" role="button">Lag faktaark for {region.name}</a>
          </div>
        </div>
        <div className="wrapper">
          <div className="grid">
            <StatSummaries groupData={this.props.groupData} regions={regions}/>
          </div>
        </div>
      </div>
    )
  }
});
