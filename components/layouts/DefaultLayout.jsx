import React from 'react'

/**
 * Only for development
 */
export default class DefaultLayout {
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
