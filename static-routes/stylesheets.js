var sass = require('node-sass');
var path = require('path');
var config = require('../config');
var fs = require('fs');
var imdino = require('imdi-no');

function toBase64(str) {
  return new Buffer(str).toString('base64');
}

module.exports = {
  "/stylesheets/main.css": function (callback) {
    var opts = {
      file: path.join(__dirname, "/../stylesheets/main.scss"),
      outFile: '/stylesheets/main.css',
      sourceMap: config.env === 'development',
      sourceMapEmbed: config.env === 'development',
      sourceMapContents: true,
      sourceComments: config.env === 'development',
      outputStyle: config.env === 'development' ? 'nested' : 'compressed',
      includePaths: imdino.includePaths
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
  const httpPath = path.join('gfx', file);

  module.exports[httpPath] = function() {
    return fs.createReadStream(fullPath);
  }

});