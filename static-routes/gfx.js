const fs = require('fs');
const imdino = require('imdi-no');
const path = require('path');

fs.readdirSync(imdino.paths.gfx).forEach(file => {

  const fullPath = path.join(imdino.paths.gfx, file);
  const httpPaths = [
    path.join('/imdi-no/_themes/blank/gfx', file),
    path.join('/gfx', file),
  ];

  httpPaths.forEach(httpPath => {
    module.exports[httpPath] = function() {
      return fs.createReadStream(fullPath);
    }
  });
});
