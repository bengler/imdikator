const React = require("react");
const ItemDataFetcher = require("./ItemDataFetcher");

var Select = React.createClass({
  displayName: 'Select',
  render() {
    return(
      <div className={"select " + this.props.className}>
        <select className="">
          <option>2014</option>
          <option>2013</option>
          <option>2012</option>
          <option>2011</option>
          <option>2010</option>
          <option>2009</option>
        </select>
      </div>
    )
  }
});

module.exports = React.createClass({
  displayName: 'Chart',
  render() {
    const {regions} = this.props;
    const key = this.props.id;

    // <pre>
    //  {JSON.stringify(this.props)}
    // </pre>

    // Todo: handle multiple regions
    const region = regions[0];

    return (
      <div className="imdikator-list__group infobox">
        <Select className="right" />
          <div className="toggle imdikator-list__toggle"></div>
        <h3 className="imdikator-list__heading">
          <i className="icon icon-search imdikator-list__icon"></i>
          {this.props.title}
        </h3>
        <div className="imdikator-list__main-content">
          <ItemDataFetcher id={key} key={key} item={this.props.item} regions={regions} />
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
