import less from 'less'
import fs from 'fs'
import config from '../config'
//import imdiStyles from 'imdi-styles'

const development = config.env === 'development'

export default {
  '/stylesheets/main.css'() {
    return new Promise((resolve, reject) => {
      fs.readFile(require.resolve('../stylesheets/bundles/main.less'), 'utf-8', (err, buffer) => {
        if (err) {
          return reject(err)
        }
        resolve(buffer)
      })
    })
      .then(buffer => {
        return less.render(buffer, {
          outFile: '/stylesheets/main.css',
          //paths: [imdiStyles.LESS_PATH],
          sourceMap: development ? {sourceMapFileInline: true} : false,
          compress: !development
        })
      })
      .then(output => output.css)
  }
}
