import Debug from 'debug'

const PREFIX = 'imdikator'

function create(prefix) {
  return Debug([PREFIX, prefix].filter(Boolean).join('-'))
}

const debug = create()
debug.create = create


export default debug
