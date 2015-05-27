const React = require("react");
const ItemDataFetcher = require("./ItemDataFetcher");

module.exports = React.createClass({
  displayName: 'Chart',
  render() {
    const {regions} = this.props;
    // <pre>
    //  {JSON.stringify(this.props)}
    // </pre>

    // Todo: handle multiple regions
    const region = regions[0];

    const id = `/${region.name}/${this.props.urlName}/${this.props.order}`;

    return (

      <div id={id} className="imdikator-list__group infobox">
        <h3 className="imdikator-list__heading">
          {this.props.title}
        </h3>
        <div className="imdikator-list__main-content">
          <ItemDataFetcher item={this.props.item} regions={regions} />
        </div>

        <ul className="imdikator-graph__functions">
          <li className="imdikator-graph__functions__item">
            <a href="javascript://" className="tool-link">
              <i className="icon icon-inbox"></i>
              <span>Last ned bilde</span>
            </a>
          </li>
          <li className="imdikator-graph__functions__item">
            <a href="javascript://" className="tool-link">
              <i className="icon icon-inbox"></i>
              <span>Last ned Excel-fil (csv)</span>
            </a>
          </li>
          <li className="imdikator-graph__functions__item">
            <a href="javascript://" className="tool-link">
              <i className="icon icon-share"></i>
              <span>Del denne statistikken</span>
            </a>
          </li>

          <li className="imdikator-graph__functions__item">
            <a href="javascript://" className="tool-link">
              <i className="icon icon-paper"></i>
              <span>Om tallene</span>
            </a>
          </li>
        </ul>

      </div>
    )
  }
});
