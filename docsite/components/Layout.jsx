import React from 'react'

export default class Layout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
          <title>IMDI Testbed</title>
          <link rel="stylesheet" href="/build/stylesheets/docsite.css" />
        </head>
        <body>
          <div id="page-content" className="page__master">
            <main className="page">
              <div className="page__content">
                <div className="wrapper">
                  <div className="row">
                    <div id="main" />
                  </div>
                </div>
              </div>
            </main>
          </div>
          <script src="/build/js/bundles/test.js" />
        </body>
      </html>
    )
  }
}
