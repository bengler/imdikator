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

const site = createBundle([
  //env === 'development' && require.resolve('../lib/react-a11y'),
  require.resolve('../bundles/site/entry.jsx')
].filter(Boolean))

const loader = createBundle([
  require.resolve('../bundles/loader.js')
].filter(Boolean))

const embeds = createBundle([
  require.resolve('../bundles/embeds/entry.jsx')
].filter(Boolean))

const embedsDebug = createBundle([
  require.resolve('../bundles/debug/embeds.jsx')
].filter(Boolean))

const test = createBundle(require.resolve('../docsite/bundle.jsx'))

export default {

  '/build/js/loader.js'() {
    console.time(';// Bundle') // eslint-disable-line no-console
    const bundle = loader()
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
  '/build/js/embeds.js'() {
    console.time(';// Bundle') // eslint-disable-line no-console
    const bundle = embeds()
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
  '/build/js/embeds-debug.js'() {
    console.time(';// Bundle') // eslint-disable-line no-console
    const bundle = embedsDebug()
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
  '/build/js/site.js'() {
    console.time(';// Bundle') // eslint-disable-line no-console
    const bundle = site()
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
  '/build/js/test.js'() {
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
