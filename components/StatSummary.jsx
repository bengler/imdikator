const React = require("react");

module.exports = React.createClass({
  displayName: 'StatSummary',
  render() {
    const statURL = `#/${this.props.regions[0].name}/${this.props.urlName}`

    return (
      <li className="navigation__link navigation__link--main"> 
        <a href={statURL}>
          {this.props.title}
          <i className="icon right icon-chevron-right"></i>
        </a>
      </li>
    )
  }
});
