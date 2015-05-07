const React = require("react");

module.exports = React.createClass({
  displayName: 'Loader',
  render() {
    return (
      <div className="imdikator-loader">
        <div className="imdikator-loader__spinner"></div>
        <div className="imdikator-loader__text">{this.props.children}</div>
      </div>
    )
  }
});
