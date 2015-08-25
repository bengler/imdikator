import React from 'react'

/**
 * Only for development
 */
export default class DefaultLayout extends React.Component {
  uncovered() {
    (function nothing() {
      return 'This method is never called and should affect code coverage. Remove soon.'
    })()
  }
  render() {
    return (
      <html>
      <head>
        <title>IMDI testbed</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge"/>
        <link rel="stylesheet" href="/build/stylesheets/main.css"/>
      </head>
      <body>
        <div id="content"/>
        <script src="/build/js/bundles/main.js" async defer/>
      </body>
      </html>
    )
  }
}
