var sass = require('node-sass');
var path = require('path');
var config = require('../config');
var imdino = require('imdi-no');

function toBase64(str) {
  return new Buffer(str).toString('base64');
}

module.exports = {
  "/stylesheets/main.css": function (callback) {
    var opts = {
      file: path.join(__dirname, "/../stylesheets/main.scss"),
      outFile: '/stylesheets/main.css',
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true,
      sourceComments: config.env === 'development',
      omitSourceMapUrl: true,
      outputStyle: config.env === 'development' ? 'nested' : 'compressed',
      includePaths: imdino.includePaths
    };
    sass.render(opts, function (err, result) {
        if (err) {
          return callback(err)
        }

        if (!result.map.version) {
          return callback(null, result.css);
        }

        var comment = "/*# sourceMappingURL=data:application/json;base64," + toBase64(JSON.stringify(result.map)) + "*/";
        callback(null, result.css + "\n" + comment);
      }
    );
  }
};
