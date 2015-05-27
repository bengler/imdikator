const React = require("react");

module.exports = React.createClass({
  displayName: 'StatSummary',
  render() {
    const statURL = `#/${this.props.regions[0].name}/${this.props.urlName}`

    return (
      <div className="infobox">
        <a href={statURL} classNane="infobox__title">
          {this.props.title}
        </a>
      </div>
    )
  }
});
