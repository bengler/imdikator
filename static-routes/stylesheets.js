import less from 'less'
import fs from 'fs'
import path from 'path'
import config from '../config'
import readdir from 'fs-readdir-recursive'

const imdiStylesRoot = path.dirname(require.resolve('imdi-styles'))

const development = config.env === 'development'

const stylesRelPath = './Styles/global'

export default {
  '/build/stylesheets/main.css'() {

    const importStatements = readdir(path.join(imdiStylesRoot, stylesRelPath))
      .map(file => `@import "${path.join('imdi-styles', stylesRelPath, file)}";`)
    .concat(`@import "./stylesheets/bundles/main.less";`)

    return Promise.resolve(importStatements.join('\n'))
      .then(buffer => {
        return less.render(buffer, {
          outFile: '/stylesheets/main.css',
          paths: [path.join(__dirname, '../node_modules')],
          sourceMap: development ? {sourceMapFileInline: true} : false,
          compress: !development
        })
      })
      .then(output => output.css)
  },
  '/build/stylesheets/docsite.css'() {
    return new Promise((resolve, reject) => {
      fs.readFile(require.resolve('../stylesheets/bundles/docsite.less'), 'utf-8', (err, buffer) => {
        if (err) {
          return reject(err)
        }
        resolve(buffer)
      })
    })
      .then(buffer => {
        return less.render(buffer, {
          outFile: '/stylesheets/docsite.css',
          paths: [path.join(__dirname, '../node_modules')],
          sourceMap: development ? {sourceMapFileInline: true} : false,
          compress: !development
        })
      })
      .then(output => output.css)
  }
}
