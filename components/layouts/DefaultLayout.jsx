import React from 'react'

/**
 * Only for development
 */
export default class DefaultLayout extends React.Component {
  uncovered() {
    console.log("This method is never called and should affect code coverage. Remove soon.")
  }
  render() {
    return (
      <html>
      <head>
        <title>IMDI testbed</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge"/>
        <link rel="stylesheet" href="/build/stylesheets/main.css"/>
        <script src="/build/js/bundles/main.js" async defer/>
      </head>
      <body>
        <div id="content"/>
      </body>
      </html>
    )
  }
}
