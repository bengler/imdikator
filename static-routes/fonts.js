const fs = require('fs');
const imdino = require('imdi-no');
const path = require('path');

const paths = [
  '/siri',
  '/'
];

paths.forEach(p => {
  const srcDir = path.join(imdino.paths.fonts, p);
  fs.readdirSync(srcDir)
    .forEach(file => {
      const srcPath = path.join(srcDir, file);
      if (fs.statSync(srcPath).isDirectory()) {
        return;
      }
      console.log("Mapping ", path.join('/fonts', p, file), ' => ', srcPath)
      module.exports[path.join('/fonts', p, file)] = function () {
        return fs.createReadStream(srcPath);
      }
    });
})