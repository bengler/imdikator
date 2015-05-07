const React = require("react");

module.exports = React.createClass({
  displayName: 'Heading',
  render() {
    return (
      <h2 className="imdikator-list__collection-heading">
        <i className="icon icon-search imdikator-list__icon"></i>{this.props.title}
      </h2>
    )
  }
});
