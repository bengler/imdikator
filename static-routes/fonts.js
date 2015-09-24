import fs from 'fs'
import readdir from 'fs-readdir-recursive'
import path from 'path'
import imdiStyles from 'imdi-styles'

export default readdir(imdiStyles.FONTS_PATH).reduce((routes, filepath) => {
  routes[path.join('/UI/fonts', filepath)] = function () {
    return fs.createReadStream(path.join(imdiStyles.FONTS_PATH, filepath))
  }
  return routes
}, {})
