const React = require("react/addons");
const cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'Table',

  getInitialState() {
    return {opened: false};
  },

  toggle() {
    console.log("toggle");
    this.setState({opened: !this.state.opened});
  },

  render() {

    let imdikatorTableExpanderClasses = cx({
      "table-toggle": true,
      "opened": this.state.opened
    });

    let tableClasses = cx({
      "table": true,
      "table--fluid": true,
      "imdikator-table__table": true,
      "opened": this.state.opened
    });

    let tableToggleClasses = cx({
      "table-toggle__toggle": true,
      "table-toggle__toggle--close": this.state.opened
    });

    return (
      <div className="imdikator-table">
        <div className={imdikatorTableExpanderClasses}>
          <a className={tableToggleClasses} href="javascript://" onClick={this.toggle}>
            Vis tabell
          </a>
        </div>
        <table className={tableClasses}>
          <thead>
            <tr>
              <th>Label</th>
              <th className="table--cell__right">Header 1</th>
              <th className="table--cell__right">Header 2</th>
              <th className="table--cell__right">Header 3</th>
              <th className="table--cell__right">Header 4</th>
              <th className="table--cell__right">Header 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row header</td>
              <td className="table--cell__right">100.000</td>
              <td className="table--cell__right">200.000</td>
              <td className="table--cell__right">300.000</td>
              <td className="table--cell__right">400.000</td>
              <td className="table--cell__right">500.000</td>
            </tr>
            <tr>
              <td>Row header</td>
              <td className="table--cell__right">100.000</td>
              <td className="table--cell__right">200.000</td>
              <td className="table--cell__right">300.000</td>
              <td className="table--cell__right">400.000</td>
              <td className="table--cell__right">500.000</td>
            </tr>
            <tr>
              <td>Row header</td>
              <td className="table--cell__right">100.000</td>
              <td className="table--cell__right">200.000</td>
              <td className="table--cell__right">300.000</td>
              <td className="table--cell__right">400.000</td>
              <td className="table--cell__right">500.000</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
});
