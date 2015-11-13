import browserify from 'browserify'
import rebundler from 'rebundler'
import SpawnStream from 'spawn-stream'

import {env} from '../config'
//import collapser from 'bundle-collapser/plugin'

import babelify from 'babelify'
import envify from 'envify'

function createBundle(entries) {

  return rebundler({noop: env !== 'development'}, (cache, pkgCache) => {
    return browserify(entries, {
      cache: cache,
      packageCache: pkgCache,
      extensions: ['.jsx'],
      debug: env == 'development',
      fullPaths: env == 'development'
    })
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

const main = createBundle([
  //env === 'development' && require.resolve('../lib/react-a11y'),
  require.resolve('../bundles/main/entry.jsx')
].filter(Boolean))

const test = createBundle(require.resolve('../docsite/bundle.jsx'))

export default {
  '/build/js/bundles/main.js'() {
    console.time(';// Bundle') // eslint-disable-line no-console
    const bundle = main()
      .transform(babelify)
      .transform(envify, {global: env !== 'development'})

    if (env !== 'development') {
      //bundle.plugin(collapser)
    }

    const stream = bundle.bundle()

    if (env !== 'development') {
      return stream.pipe(uglify())
    }

    stream.on('end', () => {
      console.timeEnd(';// Bundle') // eslint-disable-line no-console
    })
    return stream
  },
  '/build/js/bundles/test.js'() {
    if (env !== 'development') {
      return '// only development'
    }
    return test()
      .transform('redocify')
      .transform(babelify)
      .transform(envify, {global: env !== 'development'})
      .bundle()
  }
}
