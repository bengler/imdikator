var browserify = require('browserify');
var rebundler = require("rebundler");
var path = require("path");
var SpawnStream = require("spawn-stream");

var env = require("../config").env;

var to5ify = require("6to5ify");

function createBundle(entry) {

  return rebundler({noop: env !== 'development'}, function(cache, pkgCache) {
    return browserify(entry, {
      cache:         cache,
      packageCache:  pkgCache,
      extensions:    ['.jsx'],
      debug:         env == 'development',
      fullPaths:     env == 'development'
    })
      .transform(to5ify.configure({
        experimental: true
      }))
      .transform('envify', {global: true});
  });
}

function uglify() {
  return SpawnStream(require.resolve('uglify-js/bin/uglifyjs'), [
    '--compress',
    '--mangle',
    '--screw-ie8'
  ]);
}

var main = createBundle(require.resolve('../bundles//default.js'));
module.exports = {
  "/bundles/default.js": function() {
    var b = main();

    if (env !== 'development') {
      b.plugin('bundle-collapser/plugin');
    }

    var stream = b.bundle();

    if (env !== 'development') {
      return stream.pipe(uglify());
    }

    return stream
  }
};
