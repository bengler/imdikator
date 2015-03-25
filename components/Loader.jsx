const React = require("react");

module.exports = React.createClass({
  displayName: 'Loader',
  render() {
    return (
      <div className="imdikator-chart-loader">
        <div className="imdikator-chart-loader__spinner"></div>
        <div className="imdikator-chart-loader__text">{this.props.children}</div>
      </div>
    )
  }
});
