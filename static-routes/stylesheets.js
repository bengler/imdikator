const sass = require('node-sass');
const path = require('path');
const config = require('../config');
const fs = require('fs');
const imdino = require('imdi-no');

const development = config.env === 'development';

module.exports = {
  "/stylesheets/main.css": function (callback) {

    const opts = {
      file:               require.resolve("../stylesheets/main.scss"),
      outFile:            '/stylesheets/main.css',
      includePaths:       imdino.includePaths,

      sourceMap:          development,
      sourceMapEmbed:     development,
      sourceMapContents:  development,
      sourceComments:     development,
      outputStyle:        development ? 'nested' : 'compressed'
    };

    sass.render(opts, (err, result)=> {
      if (err) {
        return callback(err)
      }
      callback(null, result.css);
    });
  }
};

fs.readdirSync(imdino.paths.gfx).forEach(file => {

  const fullPath = path.join(imdino.paths.gfx, file);
  const httpPaths = [
    path.join('/imdi-no/_themes/blank/gfx', file),
    path.join('/gfx', file)
  ];

  httpPaths.forEach(httpPath => {
    module.exports[httpPath] = function() {
      return fs.createReadStream(fullPath);
    }
  });
});
