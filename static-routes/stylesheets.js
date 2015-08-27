import less from 'less'
import fs from 'fs'
import path from 'path'
import config from '../config'

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
          paths: [path.join(__dirname, '../node_modules')],
          sourceMap: development ? {sourceMapFileInline: true} : false,
          compress: !development
        })
      })
      .then(output => output.css)
  }
}
