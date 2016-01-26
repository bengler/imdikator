import browserify from 'browserify'
import rebundler from 'rebundler'
import SpawnStream from 'spawn-stream'

import config from '../config'
import collapser from 'bundle-collapser/plugin'

import babelify from 'babelify'

const UGLIFY_CMD = require.resolve('uglify-js/bin/uglifyjs')

function uglify() {
  return SpawnStream(UGLIFY_CMD, [
    '--compress',
    '--mangle',
    '--screw-ie8'
  ])
}

function createBundle(entries, addTransforms) {
  if (!Array.isArray(entries)) {
    return createBundle([entries])
  }

  const rebundle = rebundler({noop: config.env !== 'development'}, (cache, pkgCache) => {
    const bundle = browserify(entries.filter(Boolean).map(require.resolve), {
      cache: cache,
      packageCache: pkgCache,
      extensions: ['.jsx'],
      debug: config.env == 'development',
      fullPaths: config.env == 'development'
    })
      .transform(babelify)

    if (addTransforms) {
      addTransforms(bundle)
    }

    if (config.env !== 'development') {
      bundle.plugin(collapser)
    }
    return bundle
  })

  return function build() {
    console.time(';// Bundle') // eslint-disable-line no-console

    const bundle = rebundle()

    const stream = bundle.bundle()

    if (config.env !== 'development') {
      return stream.pipe(uglify())
    }

    stream.on('end', () => {
      console.timeEnd(';// Bundle') // eslint-disable-line no-console
    })
    return stream
  }
}

function define(route, factory) {
  return {route, factory}
}

export default ([
  define('/build/js/loader.js', createBundle('../bundles/loader.js')),
  define('/build/js/embeds.js', createBundle('../bundles/embeds/entry.jsx')),
  define('/build/js/site.js', createBundle([
    //config.env === 'development' && '../lib/react-a11y',
    '../bundles/site/entry.jsx'
  ])),
  config.env !== 'production' && define('/build/js/test.js', createBundle('../docsite/bundle.jsx', bundle => bundle.transform('redocify'))),
  config.env !== 'production' && define('/build/js/embeds-debug.js', createBundle('../bundles/debug/embeds.jsx')),
  config.env !== 'production' && define('/build/js/render-debug.js', createBundle('../bundles/debug/render.jsx'))
])
  .filter(Boolean)
  .reduce((acc, def) => {
    acc[def.route] = def.factory
    return acc
  }, {})
