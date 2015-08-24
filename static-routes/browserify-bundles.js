import browserify from 'browserify'
import rebundler from 'rebundler'
import SpawnStream from 'spawn-stream'

import {env} from '../config'
import collapser from 'bundle-collapser/plugin'

import babelify from 'babelify'
import envify from 'envify'

function createBundle(entry) {

  return rebundler({noop: env !== 'development'}, (cache, pkgCache) => {
    return browserify(entry, {
      cache: cache,
      packageCache: pkgCache,
      extensions: ['.jsx'],
      debug: env == 'development',
      fullPaths: env == 'development'
    })
      .transform(babelify)
      .transform(envify, {global: env !== 'development'})
  })
}

const UGLIFY_CMD = require.resolve('uglify-js/bin/uglifyjs')

function uglify() {
  return SpawnStream(UGLIFY_CMD, [
    '--compress',
    '--mangle',
    '--screw-ie8'
  ])
}

const main = createBundle(require.resolve('../bundles/main.jsx'))

export default {
  '/js/bundles/main.js'() {
    console.time('Bundle') // eslint-disable-line no-console
    const bundle = main()

    if (env !== 'development') {
      bundle.plugin(collapser)
    }

    const stream = bundle.bundle()

    if (env !== 'development') {
      return stream.pipe(uglify())
    }

    stream.on('end', () => {
      console.timeEnd('Bundle') // eslint-disable-line no-console
    })
    return stream
  }
}
