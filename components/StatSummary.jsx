const React = require("react");

module.exports = React.createClass({
  displayName: 'StatSummary',
  render() {
    const statURL = `#/${this.props.regions[0].name}/${this.props.urlName}`

    return (
      <div className="col-12">
        <a href={statURL}>
          {this.props.title}
        </a>
      </div>
    )
  }
});
