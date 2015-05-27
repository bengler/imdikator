const browserify = require('browserify');
const rebundler = require("rebundler");
const SpawnStream = require("spawn-stream");

const env = require("../config").env;
const collapser = require('bundle-collapser/plugin');

const babelify = require("babelify");

function createBundle(entry) {

  return rebundler({noop: env !== 'development'}, function(cache, pkgCache) {
    return browserify(entry, {
      cache: cache,
      packageCache: pkgCache,
      extensions: ['.jsx'],
      debug: env == 'development',
      fullPaths: env == 'development'
    })
      .transform(babelify)
      .transform('envify', {global: env !== 'development'});
  });
}

const UGLIFY_CMD = require.resolve('uglify-js/bin/uglifyjs');

function uglify() {
  return SpawnStream(UGLIFY_CMD, [
    '--compress',
    '--mangle',
    '--screw-ie8'
  ]);
}

const main = createBundle(require.resolve('../bundles//default.jsx'));

module.exports = {
  "/bundles/default.js": function() {
    console.time("Bundle"); // eslint-disable-line no-console
    const b = main();

    if (env !== 'development') {
      b.plugin(collapser);
    }

    const stream = b.bundle();

    if (env !== 'development') {
      return stream.pipe(uglify());
    }

    stream.on('end', function() {
      console.timeEnd("Bundle"); // eslint-disable-line no-console
    });
    return stream
  }
};
