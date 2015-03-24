const React = require("react");

const Groups = require("./Groups.jsx");

module.exports = React.createClass({
  displayName: 'RegionalStats',
  render() {

    return (
<<<<<<< HEAD
      <div className="imdikator-list__wrapper">
        <p className="imdikator-preamble">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium quam vel est vulputate, quis accumsan risus tincidunt. Suspendisse bibendum placerat laoreet. In imperdiet in neque quis dignissim. Phasellus quis magna aliquet, euismod nulla eu, viverra lectus. Phasellus vehicula ultricies laoreet. Etiam at rhoncus elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;</p>
        <Groups groupData={this.props.groupData} />
=======
      <div>
        <Groups groupData={this.props.groupData} regions={this.props.regions} />
>>>>>>> More WIP charts
      </div>
    )
  }
});
