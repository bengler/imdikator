const React = require('react');
module.exports = React.createClass({
  render() {
    return (
      <html>
      <head lang="en">
        <meta charSet="UTF-8"/>
        <title>Imdikator testbed</title>
        <script src="/bundles/default.js" async></script>
        <link rel="stylesheet" href="/stylesheets/main.css"/>
        <link rel="stylesheet" href="/c3.css"/>
      </head>
      <body>

      <header className="header">
        <div className="wrapper">
          <div className="col-12--lg">
            <div id="skiptocontent">
              <a href="#maincontent">Hopp til innholdet</a>
            </div>
            <a href="/" className="ident ident--compact">
              <div className="ident__symbol"></div>
              <div className="ident__textmark">
                <span className="ident__textmark-primary">IMDi</span>

                <p className="ident__textmark-secondary">Integrerings- og <br/>mangfoldsdirektoratet</p>
              </div>
            </a>
          </div>
        </div>
      </header>

      <div className="page">
        <div id="imdikator"></div>
      </div>

      <footer className="wrapper">footer</footer>
      </body>
      </html>
    )
  }
});
