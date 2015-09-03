/*eslint no-console:0, callback-return:0*/

const log = (...args) => {
  if (typeof console !== 'undefined' && console !== null) {
    if (typeof console.log === 'function') {
      console.log(...args)
    }
  }
}

export const logger = store => next => action => {
  log('dispatching', action)
  const result = next(action)
  log('next state', store.getState())
  return result
}

