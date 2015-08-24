import sass from 'node-sass'
import config from '../config'
import imdino from 'imdi-no'

const development = config.env === 'development'

export default {
  '/stylesheets/main.css'(callback) {

    const opts = {
      file: require.resolve('../stylesheets/main.scss'),
      outFile: '/stylesheets/main.css',
      includePaths: [imdino.paths.scss],

      sourceMap: development,
      sourceMapEmbed: development,
      sourceMapContents: development,
      sourceComments: development,
      outputStyle: development ? 'nested' : 'compressed'
    }

    sass.render(opts, (err, result) => {
      if (err) {
        return callback(err)
      }
      callback(null, result.css)
    })
  }
}
