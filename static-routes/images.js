import fs from 'fs'
import readdir from 'fs-readdir-recursive'
import path from 'path'
import imdiStyles from 'imdi-styles'

const routes = {}

readdir(imdiStyles.ICONS_PATH).forEach(filepath => {
  routes[path.join('/UI//icons', filepath)] = function () {
    return fs.createReadStream(path.join(imdiStyles.ICONS_PATH, filepath))
  }
})

readdir(imdiStyles.GFX_PATH).forEach(filepath => {
  routes[path.join('/UI//gfx', filepath)] = function () {
    return fs.createReadStream(path.join(imdiStyles.GFX_PATH, filepath))
  }
})

export default routes
