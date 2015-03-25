const React = require("react");

module.exports = React.createClass({
  displayName: 'Table',
  
  render() {

    return (
      <div className="imdikator-table">
        <div className="imdikator-table__expander">
          Vis tabell
          <i>Arrow</i>
        </div>
        <table className="table table--fluid">
          <thead>
            <tr>
              <th>Label</th>
              <th>Header 1</th>
              <th>Header 2</th>
              <th>Header 3</th>
              <th>Header 4</th>
              <th>Header 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row header</td>
              <td class="table--cell__right">100.000</td>
              <td class="table--cell__right">200.000</td>
              <td class="table--cell__right">300.000</td>
              <td class="table--cell__right">400.000</td>
              <td class="table--cell__right">500.000</td>
            </tr>
            <tr>
              <td>Row header</td>
              <td class="table--cell__right">100.000</td>
              <td class="table--cell__right">200.000</td>
              <td class="table--cell__right">300.000</td>
              <td class="table--cell__right">400.000</td>
              <td>500.000</td>
            </tr>
            <tr>
              <td>Row header</td>
              <td class="table--cell__right">100.000</td>
              <td class="table--cell__right">200.000</td>
              <td class="table--cell__right">300.000</td>
              <td class="table--cell__right">400.000</td>
              <td class="table--cell__right">500.000</td>
            </tr>
          </tbody>        
        </table>
      </div>
    )
  }
});
