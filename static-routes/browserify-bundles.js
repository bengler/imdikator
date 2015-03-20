var browserify = require('browserify');
var rebundler = require("rebundler");
var path = require("path");
var SpawnStream = require("spawn-stream");

var env = require("../config").env;
var collapser = require('bundle-collapser/plugin');

var babelify = require("babelify");

function createBundle(entry) {

  return rebundler({noop: env !== 'development'}, function(cache, pkgCache) {
    return browserify(entry, {
      cache:         cache,
      packageCache:  pkgCache,
      extensions:    ['.jsx'],
      debug:         env == 'development',
      fullPaths:     env == 'development'
    })
      .transform(babelify.configure({
        experimental: true
      }))
      .transform('envify', {global: true});
  });
}

var UGLIFY_CMD = require.resolve('uglify-js/bin/uglifyjs');

function uglify() {
  return SpawnStream(UGLIFY_CMD, [
    '--compress',
    '--mangle',
    '--screw-ie8'
  ]);
}

var main = createBundle(require.resolve('../bundles//default.jsx'));

module.exports = {
  "/bundles/default.js": function() {
    var b = main();

    if (env !== 'development') {
      b.plugin(collapser);
    }

    var stream = b.bundle();

    if (env !== 'development') {
      return stream.pipe(uglify());
    }

    return stream
  }
};
